import { useEffect } from 'react';

/**
 * Hook para gerenciar SEO (Títulos e Meta Tags) dinamicamente.
 */
const useSEO = ({ title, description }) => {
  useEffect(() => {
    // Atualiza o Título
    const fullTitle = title ? `${title} | Natan Construções` : "Natan Construções | Do alicerce ao acabamento";
    document.title = fullTitle;

    // Atualiza a Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description || "Natan Construções: Materiais de construção de alta qualidade, do alicerce ao acabamento. Sua obra em boas mãos.";

  }, [title, description]);
};

export default useSEO;
