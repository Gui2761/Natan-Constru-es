import { q } from '../lib/prisma.js';

export const bannerModel = {
  async findMany({ where = {}, orderBy = {} } = {}) {
    const { clause, params } = buildWhere(where);
    const order = buildOrderBy(orderBy) || 'ORDER BY `id` ASC';
    return q(`SELECT * FROM \`Banner\` ${clause} ${order}`, params);
  },

  async create({ data = {} } = {}) {
    const [res] = await q('INSERT INTO `Banner` (`image`, `title`, `buttonText`, `link`, `active`) VALUES (?,?,?,?,?)',
      [data.image, data.title || null, data.buttonText || null, data.link || null, data.active !== false ? 1 : 0],
      true // flag para retornar o res original (insertId)
    );
    const rows = await q('SELECT * FROM `Banner` WHERE `id` = ?', [res.insertId]);
    return rows[0];
  },

  async update({ where = {}, data = {} } = {}) {
    if (Object.keys(data).length === 0) return q(`SELECT * FROM \`Banner\` WHERE id = ?`, [where.id]).then(r => r[0]);

    const setClause = Object.keys(data).map(k => `\`${k}\` = ?`).join(', ');
    const { clause, params: whereParams } = buildWhere(where);
    await q(`UPDATE \`Banner\` SET ${setClause} ${clause}`, [...Object.values(data), ...whereParams]);
    const rows = await q(`SELECT * FROM \`Banner\` ${clause}`, whereParams);
    return rows[0] || null;
  },

  async delete({ where = {} } = {}) {
    const { clause, params } = buildWhere(where);
    await q(`DELETE FROM \`Banner\` ${clause}`, params);
    return { success: true };
  }
};

// Helpers internos (serão movidos para um utils se necessário, mas mantidos aqui para compatibilidade rápida)
function buildWhere(where = {}) {
  const keys = Object.keys(where).filter(k => where[k] !== undefined);
  if (keys.length === 0) return { clause: '', params: [] };
  const clauses = keys.map(k => `\`${k}\` = ?`);
  const params = keys.map(k => where[k]);
  return { clause: 'WHERE ' + clauses.join(' AND '), params };
}

function buildOrderBy(orderBy = {}) {
  const keys = Object.keys(orderBy);
  if (keys.length === 0) return '';
  return 'ORDER BY ' + keys.map(k => `\`${k}\` ${orderBy[k].toUpperCase()}`).join(', ');
}
