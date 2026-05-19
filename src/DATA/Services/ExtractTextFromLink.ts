import { useEffect } from 'react';
import { getLinkPreview } from 'link-preview-js';

interface ExtractFromLinkProps {
  link: string;
  onSuccess: (extractedData: string) => void;
  onError: (error: string) => void;
}

export const ExtractFromLink = ({ link, onSuccess, onError }: ExtractFromLinkProps) => {
  useEffect(() => {
    const fetchText = async () => {
      if (!link) {
        onError('Aucun lien fourni');
        return;
      }

      // Optionnel : Valide si c'est une URL basique
      try {
        new URL(link); // Lance une erreur si pas une URL valide
      } catch {
        onError('Lien invalide');
        return;
      }

      try {
        const preview = await getLinkPreview(link);
        
        // Type guard pour vérifier si c'est le type avec description/title (pour pages HTML)
        if ('description' in preview && 'title' in preview) {
          const extractedText = preview.description || preview.title || 'Aucun texte extrait';
          onSuccess(extractedText);
        } else {
          onError('Le lien ne semble pas être une page HTML avec du contenu extractible (ex. : image/vidéo directe).');
        }
      } catch (error) {
        const err = "${error.message || error}";
        onError(`Erreur lors de l'extraction : ${err}`);
      }
    };

    fetchText();
  }, [link]); // Relance si le lien change

  return null; // Pas d'UI, juste la logique
};