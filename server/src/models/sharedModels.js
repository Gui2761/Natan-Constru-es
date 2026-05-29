import { q, scrub } from '../lib/prisma.js';

// --- USER MODEL ---
export const userModel = {
  async findUnique({ where = {}, include = {} } = {}) {
    const keys = Object.keys(where);
    const clause = 'WHERE ' + keys.map(k => `\`${k}\` = ?`).join(' AND ');
    const params = keys.map(k => where[k]);
    const rows = await q(`SELECT * FROM \`User\` ${clause} LIMIT 1`, params);
    if (!rows.length) return null;
    const user = rows[0];

    if (include.address) {
      const addr = await q('SELECT * FROM `Address` WHERE `userId` = ? LIMIT 1', [user.id]);
      user.address = addr[0] || null;
    }
    return user;
  },

  async create({ data = {}, include = {} } = {}) {
    const { address, ...uData } = data;
    const finalData = scrub(uData);
    
    if (finalData.role === undefined) {
      finalData.role = 'CLIENT';
    }

    const keys = Object.keys(finalData);
    const placeholders = keys.map(() => '?').join(', ');
    const fields = keys.map(k => `\`${k}\``).join(', ');

    const [res] = await q(
      `INSERT INTO \`User\` (${fields}) VALUES (${placeholders})`,
      Object.values(finalData),
      true
    );

    const userId = res.insertId;

    if (address && address.create) {
      const addrData = scrub(address.create);
      const addrKeys = Object.keys(addrData);
      const addrPlaceholders = ['?', ...addrKeys.map(() => '?')].join(', ');
      const addrFields = ['\`userId\`', ...addrKeys.map(k => `\`${k}\``)].join(', ');

      await q(
        `INSERT INTO \`Address\` (${addrFields}) VALUES (${addrPlaceholders})`,
        [userId, ...Object.values(addrData)],
        true
      );
    }

    return this.findUnique({ where: { id: userId }, include });
  },

  async update({ where = {}, data = {} } = {}) {
    const { address, ...uData } = data;
    const finalData = scrub(uData);
    if (Object.keys(finalData).length > 0) {
      const setClause = Object.keys(finalData).map(k => `\`${k}\` = ?`).join(', ');
      await q(`UPDATE \`User\` SET ${setClause} WHERE \`id\` = ?`, [...Object.values(finalData), where.id]);
    }
    return this.findUnique({ where });
  }
};

// --- CATEGORY MODEL ---
export const categoryModel = {
  async findMany({ orderBy = {} } = {}) {
    const order = orderBy.name ? `ORDER BY c.\`name\` ${orderBy.name.toUpperCase()}` : 'ORDER BY c.\`name\` ASC';
    const rows = await q(`
      SELECT c.*, COUNT(p.id) as productsCount 
      FROM \`Category\` c 
      LEFT JOIN \`Product\` p ON c.id = p.categoryId 
      GROUP BY c.id
      ${order}
    `);
    
    return rows.map(r => ({
      ...r,
      _count: { products: r.productsCount }
    }));
  },
  async findUnique({ where = {} } = {}) {
    const keys = Object.keys(where);
    const clause = 'WHERE ' + keys.map(k => `\`${k}\` = ?`).join(' AND ');
    return q(`SELECT * FROM \`Category\` ${clause} LIMIT 1`, keys.map(k => where[k])).then(r => r[0] || null);
  },
  async create({ data = {} } = {}) {
    const [res] = await q('INSERT INTO `Category` (`name`, `slug`) VALUES (?, ?)', [data.name, data.slug], true);
    return this.findUnique({ where: { id: res.insertId } });
  },
  async update({ where = {}, data = {} } = {}) {
    const setClause = Object.keys(data).map(k => `\`${k}\` = ?`).join(', ');
    await q(`UPDATE \`Category\` SET ${setClause} WHERE \`id\` = ?`, [...Object.values(data), where.id]);
    return this.findUnique({ where });
  },
  async delete({ where = {} } = {}) {
    await q('DELETE FROM `Category` WHERE `id` = ?', [where.id]);
    return { success: true };
  }
};

// Helpers internos para cláusulas dinâmicas
function buildWhere(where = {}) {
  const keys = Object.keys(where).filter(k => where[k] !== undefined);
  if (keys.length === 0) return { clause: '', params: [] };
  const clauses = keys.map(k => `\`${k}\` = ?`);
  const params = keys.map(k => where[k]);
  return { clause: 'WHERE ' + clauses.join(' AND '), params };
}

// --- ORDER MODEL ---
export const orderModel = {
  async findMany({ where = {}, include = {}, orderBy = {} } = {}) {
    const { clause, params } = buildWhere(where);
    const order = orderBy.createdAt ? `ORDER BY \`createdAt\` ${orderBy.createdAt.toUpperCase()}` : 'ORDER BY `createdAt` DESC';
    const rows = await q(`SELECT * FROM \`Order\` ${clause} ${order}`, params); 

    if (include.user && rows.length) {
      const userIds = [...new Set(rows.map(r => r.userId))];
      const users = await q(`SELECT * FROM \`User\` WHERE \`id\` IN (${userIds.map(() => '?').join(',')})`, userIds);
      
      const includeAddress = include.user.include && include.user.include.address;
      let addressMap = {};
      if (includeAddress && users.length) {
        const addresses = await q(`SELECT * FROM \`Address\` WHERE \`userId\` IN (${userIds.map(() => '?').join(',')})`, userIds);
        addressMap = Object.fromEntries(addresses.map(a => [a.userId, a]));
      }

      const userMap = Object.fromEntries(users.map(u => {
        if (includeAddress) {
          u.address = addressMap[u.id] || null;
        }
        return [u.id, u];
      }));

      for (const o of rows) {
        o.user = userMap[o.userId] || null;
      }
    }
    return rows;
  },
  async findUnique({ where = {} } = {}) {
    const keys = Object.keys(where);
    const clause = 'WHERE ' + keys.map(k => `\`${k}\` = ?`).join(' AND ');
    return q(`SELECT * FROM \`Order\` ${clause} LIMIT 1`, keys.map(k => where[k])).then(r => r[0] || null);
  },
  async create({ data = {} } = {}) {
    const [res] = await q(
      'INSERT INTO `Order` (`userId`, `items`, `totalAmount`, `status`, `createdAt`) VALUES (?,?,?,?,NOW(3))',
      [data.userId, typeof data.items === 'string' ? data.items : JSON.stringify(data.items), data.totalAmount, data.status || 'PENDENTE'],
      true
    );
    return q('SELECT * FROM `Order` WHERE `id` = ?', [res.insertId]).then(r => r[0]);
  },
  async update({ where = {}, data = {} } = {}) {
    const setClause = Object.keys(data).map(k => `\`${k}\` = ?`).join(', ');
    await q(`UPDATE \`Order\` SET ${setClause} WHERE \`id\` = ?`, [...Object.values(data), where.id]);
    return this.findUnique({ where });
  },
  async delete({ where = {} } = {}) {
    await q('DELETE FROM `Order` WHERE `id` = ?', [where.id]);
    return { success: true };
  }
};

// --- COUPON MODEL ---
export const couponModel = {
  async findMany() {
    return q('SELECT * FROM `Coupon` ORDER BY `id` DESC');
  },
  async findUnique({ where = {} } = {}) {
    const keys = Object.keys(where);
    const clause = 'WHERE ' + keys.map(k => `\`${k}\` = ?`).join(' AND ');
    return q(`SELECT * FROM \`Coupon\` ${clause} LIMIT 1`, keys.map(k => where[k])).then(r => r[0] || null);
  },
  async findFirst({ where = {} } = {}) {
    const keys = Object.keys(where);
    const clause = keys.length ? 'WHERE ' + keys.map(k => `\`${k}\` = ?`).join(' AND ') : '';
    const params = keys.map(k => (where[k] === true ? 1 : where[k] === false ? 0 : where[k]));
    return q(`SELECT * FROM \`Coupon\` ${clause} LIMIT 1`, params).then(r => r[0] || null);
  },
  async create({ data = {} } = {}) {
    const [res] = await q('INSERT INTO `Coupon` (`code`, `discount`, `active`, `expiresAt`) VALUES (?,?,?,?)', 
      [data.code, data.discount, data.active !== false ? 1 : 0, data.expiresAt || null], true);
    return this.findUnique({ where: { id: res.insertId } });
  },
  async update({ where = {}, data = {} } = {}) {
    const setClause = Object.keys(data).map(k => `\`${k}\` = ?`).join(', ');
    await q(`UPDATE \`Coupon\` SET ${setClause} WHERE \`id\` = ?`, [...Object.values(data), where.id]);
    return this.findUnique({ where });
  },
  async delete({ where = {} } = {}) {
    await q('DELETE FROM `Coupon` WHERE `id` = ?', [where.id]);
    return { success: true };
  }
};
