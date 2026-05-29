import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateBlueprintPDF = (order) => {
  const doc = new jsPDF();

  // Cores do Design System Natan
  const primaryColor = [0, 52, 95];   // Azul Deep
  const secondaryColor = [253, 129, 33]; // Laranja Blueprint
  const textColor = [26, 28, 31];

  // Cabeçalho / Banner Superior
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');

  // Linha Decorativa Laranja
  doc.setFillColor(...secondaryColor);
  doc.rect(0, 40, 210, 3, 'F');

  // Título do PDF
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('NATAN CONSTRUÇÕES', 15, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('ORÇAMENTO DE MATERIAIS - QUALIDADE PROFISSIONAL', 15, 28);
  doc.text('Do alicerce ao acabamento', 15, 33);

  // Informações da Empresa (Lado Direito do Cabeçalho)
  doc.setFontSize(8);
  doc.text('CNPJ: 12.345.678/0001-99', 140, 15);
  doc.text('WhatsApp: (79) 99674-1307', 140, 20);
  doc.text('natan.obras@suaobra.com.br', 140, 25);
  doc.text('www.natanconstrucoes.com.br', 140, 30);

  // Corpo do Orçamento
  doc.setTextColor(...textColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Orçamento #${order.id || 'RASCUNHO'}`, 15, 55);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data de Emissão: ${new Date(order.createdAt || Date.now()).toLocaleString()}`, 15, 62);
  doc.text(`Válido por: 10 dias úteis`, 15, 67);

  // Linha separadora leve
  doc.setDrawColor(220, 220, 220);
  doc.line(15, 72, 195, 72);

  // Informações do Cliente (Se houver)
  if (order.user) {
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMAÇÕES DO CLIENTE:', 15, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nome: ${order.user.name}`, 15, 86);
    doc.text(`Telefone: ${order.user.phone || 'Não informado'}`, 15, 92);
    doc.text(`E-mail: ${order.user.email}`, 15, 98);
    
    if (order.user.address) {
      const addr = order.user.address;
      doc.text(`Endereço: ${addr.street}, ${addr.number} ${addr.complement ? `- ${addr.complement}` : ''}`, 15, 104);
      doc.text(`Cidade/UF: ${addr.city}/${addr.state} - CEP: ${addr.zipCode}`, 15, 110);
      if (order.deliveryNotes) {
        doc.text(`Observações: ${order.deliveryNotes}`, 15, 116);
      }
    }
  }

  // Itens do Pedido (Tabela)
  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  const tableRows = items.map((item, idx) => [
    idx + 1,
    item.name,
    item.quantity,
    `R$ ${item.finalPrice.toFixed(2)}`,
    `${(item.weight || 0).toFixed(2)} kg`,
    `R$ ${(item.finalPrice * item.quantity).toFixed(2)}`
  ]);

  // Adicionando a Tabela usando jspdf-autotable
  const tableStartY = order.user ? (order.deliveryNotes ? 124 : 116) : 80;
  doc.autoTable({
    startY: tableStartY,
    head: [['Item', 'Descrição', 'Qtd', 'Preço Unitário', 'Peso Unitário', 'Subtotal']],
    body: tableRows,
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    margin: { left: 15, right: 15 }
  });

  // Rodapé da Tabela com Totais
  const finalY = doc.lastAutoTable.finalY + 15;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Peso Total da Carga: ${(order.totalWeight || 0).toFixed(2)} kg`, 15, finalY);

  if (order.shippingService === 'PICKUP') {
    doc.text(`Opção de Entrega: Buscar na Loja (Grátis)`, 15, finalY + 6);
  } else {
    doc.text(`Opção de Entrega: Caminhão da Empresa`, 15, finalY + 6);
    doc.text(`Frete Logístico: R$ ${order.shippingCost.toFixed(2)}`, 15, finalY + 12);
  }

  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  const totalOffset = order.shippingService === 'PICKUP' ? 5 : 8;
  doc.text(`VALOR TOTAL: R$ ${order.totalAmount.toFixed(2)}`, 120, finalY + totalOffset);

  // Termos de Compromisso / Assinatura
  const termsY = finalY + 25;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'italic');
  doc.text('Nota: Este orçamento foi gerado eletronicamente. Os preços estão garantidos pela validade acima descrita.', 15, termsY);
  doc.text('A Natan Construções reserva-se o direito de ajustar frete no fechamento caso haja alterações de peso e cubagem.', 15, termsY + 4);

  // Salvar PDF
  doc.save(`orcamento_natan_pedido_${order.id || 'rascunho'}.pdf`);
};

// Gerar Recibo/Nota Fiscal Técnico (Auxiliar de Venda com termos e assinatura)
export const generateNotaFiscalPDF = (order) => {
  const doc = new jsPDF();

  const primaryColor = [0, 52, 95];   // Azul Deep
  const secondaryColor = [253, 129, 33]; // Laranja Blueprint
  const textColor = [26, 28, 31];

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setFillColor(...secondaryColor);
  doc.rect(0, 40, 210, 3, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('NATAN CONSTRUÇÕES', 15, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('NOTA FISCAL / RECIBO DE VENDA DE SERVIÇOS', 15, 28);
  doc.text('Documento Auxiliar de Venda Eletrônica', 15, 33);

  // Corporate Info
  doc.setFontSize(8);
  doc.text('CNPJ: 12.345.678/0001-99', 140, 15);
  doc.text('Insc. Estadual: 098.765.432-1', 140, 20);
  doc.text('Endereço: Av. Principal, 1000 - Centro, Aracaju/SE', 140, 25);
  doc.text('WhatsApp: (79) 99674-1307', 140, 30);

  // Invoice Meta
  doc.setTextColor(...textColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Nota Fiscal / Recibo #${order.id}`, 15, 55);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data de Emissão: ${new Date(order.createdAt || Date.now()).toLocaleString()}`, 15, 62);
  doc.text(`Forma de Pagamento: A Combinar no WhatsApp (PIX, Cartão, Maquininha)`, 15, 67);

  doc.setDrawColor(220, 220, 220);
  doc.line(15, 72, 195, 72);

  // Customer Info
  if (order.user) {
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO DESTINATÁRIO (CLIENTE):', 15, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nome/Razão Social: ${order.user.name}`, 15, 86);
    doc.text(`Telefone: ${order.user.phone || 'Não informado'}`, 15, 92);
    doc.text(`E-mail: ${order.user.email}`, 15, 98);
    
    if (order.user.address) {
      const addr = order.user.address;
      doc.text(`Endereço de Entrega: ${addr.street}, ${addr.number} ${addr.complement ? `- ${addr.complement}` : ''}`, 15, 104);
      doc.text(`Cidade/UF: ${addr.city}/${addr.state} - CEP: ${addr.zipCode}`, 15, 110);
      if (order.deliveryNotes) {
        doc.text(`Observações da Obra: ${order.deliveryNotes}`, 15, 116);
      }
    }
  }

  // Items Table
  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  const tableRows = items.map((item, idx) => [
    idx + 1,
    item.name,
    item.quantity,
    `R$ ${item.finalPrice.toFixed(2)}`,
    `${(item.weight || 0).toFixed(2)} kg`,
    `R$ ${(item.finalPrice * item.quantity).toFixed(2)}`
  ]);

  const tableStartY = order.user ? (order.deliveryNotes ? 124 : 116) : 80;
  doc.autoTable({
    startY: tableStartY,
    head: [['Item', 'Descrição do Produto', 'Qtd', 'Vlr. Unitário', 'Peso Unit.', 'Vlr. Total']],
    body: tableRows,
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 15, right: 15 }
  });

  const finalY = doc.lastAutoTable.finalY + 15;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Peso Total da Carga: ${(order.totalWeight || 0).toFixed(2)} kg`, 15, finalY);

  if (order.shippingService === 'PICKUP') {
    doc.text(`Modalidade do Frete: Buscar na Loja (Grátis)`, 15, finalY + 6);
  } else {
    doc.text(`Modalidade do Frete: Caminhão da Empresa`, 15, finalY + 6);
    doc.text(`Frete Total Cobrado: R$ ${order.shippingCost?.toFixed(2) || '0.00'}`, 15, finalY + 12);
  }

  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  const totalOffset = order.shippingService === 'PICKUP' ? 5 : 8;
  doc.text(`VALOR LÍQUIDO DO RECIBO: R$ ${order.totalAmount.toFixed(2)}`, 110, finalY + totalOffset);

  // Receipt terms & Signature fields
  const termY = finalY + 30;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text('Declaro ter recebido os produtos descritos nesta nota fiscal em perfeito estado de conservação.', 15, termY);

  doc.setDrawColor(180, 180, 180);
  doc.line(15, termY + 20, 95, termY + 20);
  doc.line(115, termY + 20, 195, termY + 20);
  doc.setFont('helvetica', 'bold');
  doc.text('Assinatura do Recebedor', 15, termY + 25);
  doc.text('Responsável Natan Construções', 115, termY + 25);

  doc.save(`nota_fiscal_natan_pedido_${order.id}.pdf`);
};

// Gerar Relatório de Performance Financeira (Dashboard de Vendas)
export const generateFinancialReportPDF = (report) => {
  const doc = new jsPDF();

  const primaryColor = [0, 52, 95];   // Azul Deep
  const secondaryColor = [253, 129, 33]; // Laranja Blueprint
  const textColor = [26, 28, 31];

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setFillColor(...secondaryColor);
  doc.rect(0, 40, 210, 3, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('NATAN CONSTRUÇÕES', 15, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('RELATÓRIO DE PERFORMANCE FINANCEIRA & DESEMPENHO', 15, 26);
  doc.text(`Período analisado: ${report.periodName}`, 15, 31);
  doc.text(`Data de Geração: ${new Date().toLocaleString()}`, 15, 36);

  // Corporate Info
  doc.setFontSize(8);
  doc.text('CNPJ: 12.345.678/0001-99', 140, 15);
  doc.text('Área: Controle Administrativo e Custos', 140, 20);
  doc.text('Gerado Eletronicamente via Dashboard', 140, 25);
  doc.text('www.natanconstrucoes.com.br', 140, 30);

  // Stats Card Table / Summary Block
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO DE PERFORMANCE FINANCEIRA', 15, 55);

  const summaryData = [
    ['Indicador Financeiro', 'Valor Calculado'],
    ['Faturamento Bruto', `R$ ${report.totalSales.toFixed(2)}`],
    ['Lucro Líquido Estimado', `R$ ${report.totalProfit.toFixed(2)}`],
    ['Margem de Lucro Média', `${report.margin.toFixed(1)}%`],
    ['Volume de Pedidos', `${report.ordersCount} pedidos`],
    ['Ticket Médio do Período', `R$ ${report.avgTicket.toFixed(2)}`]
  ];

  doc.autoTable({
    startY: 60,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    headStyles: { fillColor: secondaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    margin: { left: 15, right: 15 }
  });

  // Orders Table Detail
  const nextY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('HISTÓRICO DETALHADO DE PEDIDOS DO PERÍODO', 15, nextY);

  const tableRows = report.ordersList.map((order, idx) => [
    idx + 1,
    `#${order.id}`,
    new Date(order.createdAt).toLocaleDateString(),
    order.user?.name || 'Cliente N/A',
    `R$ ${order.totalAmount.toFixed(2)}`,
    `R$ ${order.estimatedCost.toFixed(2)}`,
    `R$ ${order.estimatedProfit.toFixed(2)}`
  ]);

  doc.autoTable({
    startY: nextY + 5,
    head: [['Item', 'ID Pedido', 'Data', 'Cliente', 'Faturamento', 'Custo Est.', 'Lucro Est.']],
    body: tableRows,
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 15, right: 15 }
  });

  // Footer Signature or Note
  const termsY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'italic');
  doc.text('Nota: Este relatório é confidencial e de uso exclusivo da administração da Natan Construções.', 15, termsY);
  doc.text('Os custos estimados são calculados com base no costPrice dos materiais no estoque atual.', 15, termsY + 4);

  doc.save(`relatorio_financeiro_natan_${report.periodName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`);
};
