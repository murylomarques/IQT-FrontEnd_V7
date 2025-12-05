// VistoriaPDF.jsx
// Componente que RECEBE os dados do frontend e GERA o PDF sem consultar a API.

import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// ===== ESTILOS =====
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 11,
    fontFamily: 'Helvetica'
  },
  titulo: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  secao: {
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  valor: {
    fontSize: 11,
    marginBottom: 4
  },
  itemBox: {
    marginBottom: 10,
    padding: 10,
    border: '1 solid #000',
    borderRadius: 4
  },
  img: {
    width: 180,
    height: 120,
    objectFit: 'cover',
    marginTop: 6
  },
  pageBreak: {
    marginTop: 20,
    borderTop: '1 solid #999'
  }
});

// ===== FUNÇÃO DE SANITIZAÇÃO =====
const safe = (v) => (v ? String(v) : '—');

// ===== COMPONENTE =====
export default function VistoriaPDF({ dados }) {
  // "dados" chega do frontend COMPLETO já carregado.
  // Estrutura esperada:
  // {
  //   protocolo, data, tecnico, empresa, regional,
  //   itens: [ { titulo, status, observacao, foto_url }, ... ]
  // }

  const { protocolo, data, tecnico, empresa, regional, itens } = dados;

  return (
    <Document>
      <Page size="A4" style={{ padding: 20 }}>
        <Text>Olá Mundo</Text>
      </Page>
    </Document>
  );
}