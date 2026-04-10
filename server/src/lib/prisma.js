/**
 * ADAPTADOR MySQL2 COM API COMPATÍVEL COM PRISMA
 * 
 * Substitui o Prisma Client por chamadas diretas mysql2 para evitar
 * o crash do motor Rust no ambiente Hostinger (EAGAIN / timer has gone away).
 * 
 * Todos os controllers continuam funcionando sem nenhuma alteração.
 */

import mysql from 'mysql2/promise';

// ─────────────────────────────────────────────
// 1. CONEXÃO
// ─────────────────────────────────────────────

function parseDatabaseUrl(url) {
  if (!url || url.startsWith('file:')) {
    console.error('❌ DATABASE_URL inválida. Deve começar com mysql://');
    console.error('   Valor atual:', url ? url.substring(0, 20) + '...' : 'undefined');
    throw new Error('DATABASE_URL inválida. Configure mysql:// no painel da Hostinger.');
  }
  const u = new URL(url);
  return {
    host: u.hostname,
    port: parseInt(u.port) || 3306,
    user: u.username,
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
    waitForConnections: true,
    connectionLimit: 5,
    charset: 'utf8mb4',
  };
}

let pool = null;

function getPool() {
  if (!pool) {
    const config = parseDatabaseUrl(process.env.DATABASE_URL);
    console.log(`🔌 [DB] Conectando em ${config.host}:${config.port}/${config.database}`);
    pool = mysql.createPool(config);
  }
// Função de Limpeza Profunda (Garante que nenhum undefined chegue ao MySQL2)
const scrub = (val) => {
  if (val === undefined) return null;
  if (Array.isArray(val)) return val.map(scrub);
  if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
    const next = {};
    for (const k in val) next[k] = scrub(val[k]);
    return next;
  }
  return val;
};

function sanitizeParams(params) {
  return scrub(params) || [];
}

async function q(sql, params = []) {
  const [rows] = await getPool().execute(sql, sanitizeParams(params));
  return rows;
}

// ─────────────────────────────────────────────
// 2. HELPERS INTERNOS
// ─────────────────────────────────────────────

function buildWhere(where = {}) {
  const keys = Object.keys(where);
  if (keys.length === 0) return { clause: '', params: [] };
  const clause = 'WHERE ' + keys.map(k => `\`${k}\` = ?`).join(' AND ');
  return { clause, params: Object.values(where) };
}

function buildOrderBy(orderBy = {}) {
  const keys = Object.keys(orderBy);
  if (keys.length === 0) return '';
  return 'ORDER BY ' + keys.map(k => `\`${k}\` ${orderBy[k].toUpperCase()}`).join(', ');
}

// ─────────────────────────────────────────────
// 3. USER MODEL
// ─────────────────────────────────────────────

const userModel = {
  async findUnique({ where = {}, include = {} } = {}) {
    const { clause, params } = buildWhere(where);
    const rows = await q(`SELECT * FROM \`User\` ${clause} LIMIT 1`, params);
    if (!rows.length) return null;
    const user = rows[0];

    if (include.address) {
      const addr = await q('SELECT * FROM `Address` WHERE `userId` = ? LIMIT 1', [user.id]);
      user.address = addr[0] || null;
    }
    if (include.orders) {
      user.orders = await q('SELECT * FROM `Order` WHERE `userId` = ? ORDER BY `createdAt` DESC', [user.id]);
    }
    return user;
  },

  async findMany({ where = {}, include = {}, orderBy = {} } = {}) {
    const { clause, params } = buildWhere(where);
    const order = buildOrderBy(orderBy) || 'ORDER BY `createdAt` DESC';
    const rows = await q(`SELECT * FROM \`User\` ${clause} ${order}`, params);

    for (const user of rows) {
      if (include.address) {
        const addr = await q('SELECT * FROM `Address` WHERE `userId` = ? LIMIT 1', [user.id]);
        user.address = addr[0] || null;
      }
    }
    return rows;
  },

  async create({ data = {}, include = {} } = {}) {
    const conn = await getPool().getConnection();
    try {
      await conn.beginTransaction();
      const { address, ...uData } = data;

      const [res] = await conn.execute(
        'INSERT INTO `User` (`name`, `email`, `password`, `role`, `avatar`, `createdAt`) VALUES (?, ?, ?, ?, ?, NOW(3))',
        [uData.name, uData.email, uData.password, uData.role || 'CLIENT', uData.avatar || null]
      );
      const userId = res.insertId;

      let addressRow = null;
      if (address && address.create) {
        const a = address.create;
        await conn.execute(
          'INSERT INTO `Address` (`userId`, `zipCode`, `street`, `number`, `complement`, `city`, `state`) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [userId, a.zipCode || '', a.street || '', a.number || '', a.complement || null, a.city || '', a.state || '']
        );
        const [addrRows] = await conn.execute('SELECT * FROM `Address` WHERE `userId` = ?', [userId]);
        addressRow = addrRows[0] || null;
      }

      await conn.commit();
      const [[user]] = await conn.execute('SELECT * FROM `User` WHERE `id` = ?', [userId]);
      if (include.address) user.address = addressRow;
      return user;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async update({ where = {}, data = {}, include = {} } = {}) {
    const conn = await getPool().getConnection();
    try {
      await conn.beginTransaction();
      const { address, ...uData } = data;

      if (Object.keys(uData).length > 0) {
        // Filtragem completa de undefined para evitar crash no UPDATE
        const finalData = {};
        Object.entries(uData).forEach(([k, v]) => {
          if (v !== undefined) finalData[k] = v;
        });

        if (Object.keys(finalData).length > 0) {
          const setClause = Object.keys(finalData).map(k => `\`${k}\` = ?`).join(', ');
          await conn.execute(
            `UPDATE \`User\` SET ${setClause} WHERE \`id\` = ?`,
            sanitizeParams([...Object.values(finalData), where.id])
          );
        }
      }

      if (address && address.upsert) {
        const [existing] = await conn.execute('SELECT id FROM `Address` WHERE `userId` = ?', [where.id]);
        const aData = existing.length > 0 ? address.upsert.update : address.upsert.create;
        if (existing.length > 0) {
          await conn.execute(
            'UPDATE `Address` SET `zipCode`=?, `street`=?, `number`=?, `complement`=?, `city`=?, `state`=? WHERE `userId`=?',
            sanitizeParams([aData.zipCode||'', aData.street||'', aData.number||'', aData.complement||null, aData.city||'', aData.state||'', where.id])
          );
        } else {
          await conn.execute(
            'INSERT INTO `Address` (`userId`, `zipCode`, `street`, `number`, `complement`, `city`, `state`) VALUES (?,?,?,?,?,?,?)',
            sanitizeParams([where.id, aData.zipCode||'', aData.street||'', aData.number||'', aData.complement||null, aData.city||'', aData.state||''])
          );
        }
      }

      await conn.commit();
      const [[user]] = await conn.execute('SELECT * FROM `User` WHERE `id` = ?', [where.id]);
      if (include.address) {
        const [addrRows] = await conn.execute('SELECT * FROM `Address` WHERE `userId` = ?', [where.id]);
        user.address = addrRows[0] || null;
      }
      return user;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async delete({ where = {} } = {}) {
    const { clause, params } = buildWhere(where);
    await q(`DELETE FROM \`User\` ${clause}`, params);
    return { success: true };
  }
};

// ─────────────────────────────────────────────
// 4. PRODUCT MODEL
// ─────────────────────────────────────────────

const productModel = {
  async findMany({ where = {}, include = {}, skip = 0, take, orderBy = {} } = {}) {
    const { clause, params } = buildWhere(where);
    const order = buildOrderBy(orderBy) || 'ORDER BY `createdAt` DESC';
    const limit = take ? `LIMIT ${take} OFFSET ${skip}` : '';
    const rows = await q(`SELECT * FROM \`Product\` ${clause} ${order} ${limit}`, params);

    if (include.category && rows.length) {
      const catIds = [...new Set(rows.map(r => r.categoryId))];
      const cats = await q(`SELECT * FROM \`Category\` WHERE \`id\` IN (${catIds.map(() => '?').join(',')})`, catIds);
      const catMap = Object.fromEntries(cats.map(c => [c.id, c]));
      for (const p of rows) p.category = catMap[p.categoryId] || null;
    }
    return rows;
  },

  async count({ where = {} } = {}) {
    const { clause, params } = buildWhere(where);
    const rows = await q(`SELECT COUNT(*) as cnt FROM \`Product\` ${clause}`, params);
    return rows[0].cnt;
  },

  async findUnique({ where = {}, include = {} } = {}) {
    const { clause, params } = buildWhere(where);
    const rows = await q(`SELECT * FROM \`Product\` ${clause} LIMIT 1`, params);
    if (!rows.length) return null;
    const p = rows[0];
    if (include.category) {
      const cats = await q('SELECT * FROM `Category` WHERE `id` = ?', [p.categoryId]);
      p.category = cats[0] || null;
    }
    return p;
  },

  async create({ data = {} } = {}) {
    const [res] = await getPool().execute(
      'INSERT INTO `Product` (`name`, `description`, `basePrice`, `costPrice`, `salePercentage`, `finalPrice`, `stock`, `weight`, `images`, `categoryId`, `createdAt`) VALUES (?,?,?,?,?,?,?,?,?,?,NOW(3))',
      [data.name, data.description, data.basePrice, data.costPrice||0, data.salePercentage||0, data.finalPrice, data.stock||0, data.weight||0, data.images||'', data.categoryId]
    );
    const rows = await q('SELECT * FROM `Product` WHERE `id` = ?', [res.insertId]);
    return rows[0];
  },

  async update({ where = {}, data = {} } = {}) {
    // Filtragem de undefined para evitar falha fatal no mysql2
    const finalData = {};
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined) finalData[k] = v;
    });

    if (Object.keys(finalData).length === 0) return this.findUnique({ where });

    const setClause = Object.keys(finalData).map(k => `\`${k}\` = ?`).join(', ');
    const { clause, params: whereParams } = buildWhere(where);
    await q(`UPDATE \`Product\` SET ${setClause} ${clause}`, [...Object.values(finalData), ...whereParams]);
    return this.findUnique({ where });
  },

  async delete({ where = {} } = {}) {
    const { clause, params } = buildWhere(where);
    await q(`DELETE FROM \`Product\` ${clause}`, params);
    return { success: true };
  }
};

// ─────────────────────────────────────────────
// 5. CATEGORY MODEL
// ─────────────────────────────────────────────

const categoryModel = {
  async findMany({ orderBy = {} } = {}) {
    const order = buildOrderBy(orderBy) || 'ORDER BY `name` ASC';
    return q(`SELECT * FROM \`Category\` ${order}`);
  },

  async findUnique({ where = {} } = {}) {
    const { clause, params } = buildWhere(where);
    const rows = await q(`SELECT * FROM \`Category\` ${clause} LIMIT 1`, params);
    return rows[0] || null;
  },

  async create({ data = {} } = {}) {
    const [res] = await getPool().execute(
      'INSERT INTO `Category` (`name`, `slug`) VALUES (?, ?)',
      [data.name, data.slug]
    );
    const rows = await q('SELECT * FROM `Category` WHERE `id` = ?', [res.insertId]);
    return rows[0];
  },

  async update({ where = {}, data = {} } = {}) {
    const finalData = {};
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined) finalData[k] = v;
    });
    if (Object.keys(finalData).length === 0) return this.findUnique({ where });

    const setClause = Object.keys(finalData).map(k => `\`${k}\` = ?`).join(', ');
    const { clause, params: whereParams } = buildWhere(where);
    await q(`UPDATE \`Category\` SET ${setClause} ${clause}`, [...Object.values(finalData), ...whereParams]);
    return this.findUnique({ where });
  },

  async delete({ where = {} } = {}) {
    const { clause, params } = buildWhere(where);
    await q(`DELETE FROM \`Category\` ${clause}`, params);
    return { success: true };
  }
};

// ─────────────────────────────────────────────
// 6. ORDER MODEL
// ─────────────────────────────────────────────

const orderModel = {
  async findMany({ where = {}, include = {}, orderBy = {} } = {}) {
    const { clause, params } = buildWhere(where);
    const order = buildOrderBy(orderBy) || 'ORDER BY `createdAt` DESC';
    const rows = await q(`SELECT * FROM \`Order\` ${clause} ${order}`, params);

    if (include.user && rows.length) {
      for (const ord of rows) {
        const users = await q('SELECT * FROM `User` WHERE `id` = ? LIMIT 1', [ord.userId]);
        if (users.length) {
          ord.user = users[0];
          if (include.user.include && include.user.include.address) {
            const addr = await q('SELECT * FROM `Address` WHERE `userId` = ? LIMIT 1', [ord.userId]);
            ord.user.address = addr[0] || null;
          }
        }
      }
    }
    return rows;
  },

  async create({ data = {} } = {}) {
    const [res] = await getPool().execute(
      'INSERT INTO `Order` (`userId`, `items`, `totalAmount`, `status`, `createdAt`) VALUES (?,?,?,?,NOW(3))',
      [data.userId, typeof data.items === 'string' ? data.items : JSON.stringify(data.items), data.totalAmount, data.status || 'PENDENTE']
    );
    const rows = await q('SELECT * FROM `Order` WHERE `id` = ?', [res.insertId]);
    return rows[0];
  },

  async update({ where = {}, data = {} } = {}) {
    const setClause = Object.keys(data).map(k => `\`${k}\` = ?`).join(', ');
    const { clause, params: whereParams } = buildWhere(where);
    await q(`UPDATE \`Order\` SET ${setClause} ${clause}`, [...Object.values(data), ...whereParams]);
    const rows = await q(`SELECT * FROM \`Order\` ${clause}`, whereParams);
    return rows[0] || null;
  }
};

// ─────────────────────────────────────────────
// 7. BANNER MODEL
// ─────────────────────────────────────────────

const bannerModel = {
  async findMany({ where = {}, orderBy = {} } = {}) {
    const { clause, params } = buildWhere(where);
    const order = buildOrderBy(orderBy) || 'ORDER BY `id` ASC';
    return q(`SELECT * FROM \`Banner\` ${clause} ${order}`, params);
  },

  async create({ data = {} } = {}) {
    const [res] = await getPool().execute(
      'INSERT INTO `Banner` (`image`, `title`, `buttonText`, `link`, `active`) VALUES (?,?,?,?,?)',
      [data.image, data.title || null, data.buttonText || null, data.link || null, data.active !== false ? 1 : 0]
    );
    const rows = await q('SELECT * FROM `Banner` WHERE `id` = ?', [res.insertId]);
    return rows[0];
  },

  async update({ where = {}, data = {} } = {}) {
    const finalData = {};
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined) finalData[k] = v;
    });
    if (Object.keys(finalData).length === 0) return q(`SELECT * FROM \`Banner\` WHERE id = ?`, [where.id]).then(r => r[0]);

    const setClause = Object.keys(finalData).map(k => `\`${k}\` = ?`).join(', ');
    const { clause, params: whereParams } = buildWhere(where);
    await q(`UPDATE \`Banner\` SET ${setClause} ${clause}`, [...Object.values(finalData), ...whereParams]);
    const rows = await q(`SELECT * FROM \`Banner\` ${clause}`, whereParams);
    return rows[0] || null;
  },

  async delete({ where = {} } = {}) {
    const { clause, params } = buildWhere(where);
    await q(`DELETE FROM \`Banner\` ${clause}`, params);
    return { success: true };
  }
};

// ─────────────────────────────────────────────
// 8. COUPON MODEL
// ─────────────────────────────────────────────

const couponModel = {
  async findMany() {
    return q('SELECT * FROM `Coupon` ORDER BY `id` DESC');
  },

  async findFirst({ where = {} } = {}) {
    const entries = Object.entries(where);
    if (!entries.length) {
      const rows = await q('SELECT * FROM `Coupon` LIMIT 1');
      return rows[0] || null;
    }
    const clause = 'WHERE ' + entries.map(([k]) => `\`${k}\` = ?`).join(' AND ');
    const params = entries.map(([, v]) => (v === true ? 1 : v === false ? 0 : v));
    const rows = await q(`SELECT * FROM \`Coupon\` ${clause} LIMIT 1`, params);
    return rows[0] || null;
  },

  async create({ data = {} } = {}) {
    const [res] = await getPool().execute(
      'INSERT INTO `Coupon` (`code`, `discount`, `active`, `expiresAt`) VALUES (?,?,?,?)',
      [data.code, data.discount, data.active !== false ? 1 : 0, data.expiresAt || null]
    );
    const rows = await q('SELECT * FROM `Coupon` WHERE `id` = ?', [res.insertId]);
    return rows[0];
  },

  async update({ where = {}, data = {} } = {}) {
    const setClause = Object.keys(data).map(k => `\`${k}\` = ?`).join(', ');
    const { clause, params: whereParams } = buildWhere(where);
    await q(`UPDATE \`Coupon\` SET ${setClause} ${clause}`, [...Object.values(data), ...whereParams]);
    const rows = await q(`SELECT * FROM \`Coupon\` ${clause}`, whereParams);
    return rows[0] || null;
  },

  async delete({ where = {} } = {}) {
    const { clause, params } = buildWhere(where);
    await q(`DELETE FROM \`Coupon\` ${clause}`, params);
    return { success: true };
  }
};

// ─────────────────────────────────────────────
// 9. EXPORT (mesma interface do PrismaClient)
// ─────────────────────────────────────────────

const prisma = {
  user: userModel,
  product: productModel,
  category: categoryModel,
  order: orderModel,
  banner: bannerModel,
  coupon: couponModel,

  // Utilitário para conexão direta (usado por alguns controllers)
  async $queryRaw(sql, ...params) {
    return q(sql, params);
  },

  async $disconnect() {
    if (pool) {
      await pool.end();
      pool = null;
    }
  }
};

export default prisma;
