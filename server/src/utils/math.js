/**
 * Utilitários Matemáticos e de Formatação Resiliente (Master Skill Pattern)
 */

/**
 * Converte qualquer valor para float de forma segura, tratando vírgulas e erros.
 */
export const parseResilientFloat = (val) => {
  if (val === undefined || val === null || val === '') return 0;
  const clean = val.toString().replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

/**
 * Filtra apenas números de uma string (ex: para CEP, CPF).
 */
export const cleanNumbers = (str) => {
  if (!str) return "";
  return str.toString().replace(/\D/g, '');
};

/**
 * Calcula o preço final com desconto aplicado.
 */
export const calculateFinalPrice = (basePrice, salePercentage) => {
  const price = parseResilientFloat(basePrice);
  const discount = parseResilientFloat(salePercentage);
  return price - (price * (discount / 100));
};
