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
    const order = orderBy.name ? `ORDER BY \`name\` ${orderBy.name.toUpperCase()}` : 'ORDER BY `name` ASC';
    return q(`SELECT * FROM \`Category\` ${order}`);
  },
  async findUnique({ where = {} } = {}) {
    const keys = Object.keys(where);
    const clause = 'WHERE ' + keys.map(k => `\`${k}\` = ?`).join(' AND ');
    return q(`SELECT * FROM \`Category\` ${clause} LIMIT 1`, keys.map(k => where[k])).then(r => r[0] || null);
  }
};

// --- ORDER MODEL ---
export const orderModel = {
  async findMany({ where = {}, include = {}, orderBy = {} } = {}) {
    const order = orderBy.createdAt ? `ORDER BY \`createdAt\` ${orderBy.createdAt.toUpperCase()}` : 'ORDER BY `createdAt` DESC';
    const rows = await q(`SELECT * FROM \`Order\` ${order}`); 
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
  }
};
