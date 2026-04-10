import { q } from '../lib/prisma.js';

export const productModel = {
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
    const [res] = await q(
      'INSERT INTO `Product` (`name`, `description`, `basePrice`, `costPrice`, `salePercentage`, `finalPrice`, `stock`, `weight`, `images`, `categoryId`, `createdAt`) VALUES (?,?,?,?,?,?,?,?,?,?,NOW(3))',
      [data.name, data.description, data.basePrice, data.costPrice||0, data.salePercentage||0, data.finalPrice, data.stock||0, data.weight||0, data.images||'', data.categoryId],
      true
    );
    const rows = await q('SELECT * FROM `Product` WHERE `id` = ?', [res.insertId]);
    return rows[0];
  },

  async update({ where = {}, data = {} } = {}) {
    if (Object.keys(data).length === 0) return this.findUnique({ where });

    const setClause = Object.keys(data).map(k => `\`${k}\` = ?`).join(', ');
    const { clause, params: whereParams } = buildWhere(where);
    await q(`UPDATE \`Product\` SET ${setClause} ${clause}`, [...Object.values(data), ...whereParams]);
    return this.findUnique({ where });
  },

  async delete({ where = {} } = {}) {
    const { clause, params } = buildWhere(where);
    await q(`DELETE FROM \`Product\` ${clause}`, params);
    return { success: true };
  }
};

// Helpers internos (simplificados)
function buildWhere(where = {}) {
  const keys = Object.keys(where).filter(k => where[k] !== undefined);
  if (keys.length === 0) return { clause: '', params: [] };
  
  const clauses = [];
  const params = [];

  keys.forEach(k => {
    if (k === 'OR' && Array.isArray(where[k])) {
      const orParts = where[k].map(cond => {
        const subKeys = Object.keys(cond);
        return subKeys.map(sk => {
          if (cond[sk] && typeof cond[sk] === 'object' && cond[sk].contains) {
            params.push(`%${cond[sk].contains}%`);
            return `\`${sk}\` LIKE ?`;
          }
          params.push(cond[sk]);
          return `\`${sk}\` = ?`;
        }).join(' AND ');
      });
      clauses.push(`(${orParts.join(' OR ')})`);
    } else if (where[k] && typeof where[k] === 'object' && where[k].contains) {
      clauses.push(`\`${k}\` LIKE ?`);
      params.push(`%${where[k].contains}%`);
    } else {
      clauses.push(`\`${k}\` = ?`);
      params.push(where[k]);
    }
  });

  return { clause: 'WHERE ' + clauses.join(' AND '), params };
}

function buildOrderBy(orderBy = {}) {
  const keys = Object.keys(orderBy);
  if (keys.length === 0) return '';
  return 'ORDER BY ' + keys.map(k => `\`${k}\` ${orderBy[k].toUpperCase()}`).join(', ');
}
