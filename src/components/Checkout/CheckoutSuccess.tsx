import EmptyElement from '../EmptyElement';

const CheckoutSuccess = () => {
  return (
    <EmptyElement
      title="Merci de votre achat sur Automatisme Online!"
      subtitle="Votre commande a bien été prise en compte. Retrouvez la sur votre espace client."
      ctaLabel="Voir ma commande"
      ctaSlug="/compte"
    />
  );
};

export default CheckoutSuccess;
