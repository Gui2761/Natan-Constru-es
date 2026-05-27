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
    doc.text(`E-mail: ${order.user.email}`, 15, 92);
    
    if (order.user.address) {
      const addr = order.user.address;
      doc.text(`Endereço: ${addr.street}, ${addr.number} ${addr.complement ? `- ${addr.complement}` : ''}`, 15, 98);
      doc.text(`Cidade/UF: ${addr.city}/${addr.state} - CEP: ${addr.zipCode}`, 15, 104);
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
  doc.autoTable({
    startY: order.user ? 112 : 80,
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

  if (order.shippingCost > 0) {
    doc.text(`Frete Logístico (${order.shippingService || 'PAC'}): R$ ${order.shippingCost.toFixed(2)}`, 15, finalY + 6);
  }

  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text(`VALOR TOTAL: R$ ${order.totalAmount.toFixed(2)}`, 120, finalY + 5);

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
