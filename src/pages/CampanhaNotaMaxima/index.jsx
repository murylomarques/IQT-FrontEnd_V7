const frameStyle = {
  width: '100vw',
  height: '100dvh',
  minHeight: '100vh',
  border: 0,
  display: 'block',
  background: '#e5e1cf',
};

const CampanhaNotaMaxima = () => {
  const src = `/campanha-nota-maxima.html${window.location.search || ''}`;

  return (
    <iframe
      title="Campanha Operação Nota Máxima"
      src={src}
      style={frameStyle}
    />
  );
};

export default CampanhaNotaMaxima;
