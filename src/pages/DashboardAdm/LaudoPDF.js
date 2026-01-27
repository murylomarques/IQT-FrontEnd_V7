import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Registra as fontes para um visual mais moderno.
// Certifique-se de que os arquivos de fonte estão na pasta `public/fonts`.
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

// Estilos para o documento PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 11,
    padding: 35,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1a73e8',
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  companyName: {
    fontSize: 12,
    color: '#5f6368',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#e8f0fe',
    padding: 8,
    marginBottom: 10,
    color: '#1a73e8',
    borderRadius: 4,
  },
  fieldContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 5,
  },
  fieldLabel: {
    fontWeight: 'bold',
    width: 120,
    color: '#3c4043',
  },
  fieldValue: {
    flex: 1,
    color: '#5f6368',
  },
  status: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 90,
  },
  statusPendente: { backgroundColor: '#fef7e0', color: '#f29900' },
  statusConcluido: { backgroundColor: '#e6f4ea', color: '#1e8e3e' },
  statusExecucao: { backgroundColor: '#e8f0fe', color: '#1a73e8' },
  statusVencido: { backgroundColor: '#fce8e6', color: '#d93025' },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 35,
    right: 35,
    textAlign: 'center',
    fontSize: 9,
    color: 'grey',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
});

const getStatusStyle = (status) => {
  if (status === 'Pendente') return styles.statusPendente;
  if (status === 'Concluído') return styles.statusConcluido;
  if (status === 'Em Execução') return styles.statusExecucao;
  if (status === 'Vencido') return styles.statusVencido;
  return {};
};

// Componente que renderiza o documento
function LaudoPDF({ laudo }) {
  const dataInicio = new Date(laudo.data_inicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  const dataFim = laudo.data_fim ? new Date(laudo.data_fim).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Laudo Técnico</Text>
          <Text style={styles.companyName}>Desktop IQ-IQT</Text>
        </View>

        <Text style={styles.title}>Plano de Ação - Laudo ID: {laudo.id}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes do Registro</Text>
          <View style={styles.fieldContainer}><Text style={styles.fieldLabel}>Supervisor:</Text><Text style={styles.fieldValue}>{laudo.nome_supervisor}</Text></View>
          <View style={styles.fieldContainer}><Text style={styles.fieldLabel}>Técnico:</Text><Text style={styles.fieldValue}>{laudo.nome_tecnico}</Text></View>
          <View style={styles.fieldContainer}><Text style={styles.fieldLabel}>Responsável:</Text><Text style={styles.fieldValue}>{laudo.responsavel || 'Não definido'}</Text></View>
          <View style={styles.fieldContainer}><Text style={styles.fieldLabel}>Status:</Text><Text style={[styles.status, getStatusStyle(laudo.status)]}>{laudo.status}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análise e Ação</Text>
          <View style={styles.fieldContainer}><Text style={styles.fieldLabel}>Fato:</Text><Text style={styles.fieldValue}>{laudo.fato}</Text></View>
          <View style={styles.fieldContainer}><Text style={styles.fieldLabel}>Causa:</Text><Text style={styles.fieldValue}>{laudo.causa}</Text></View>
          <View style={styles.fieldContainer}><Text style={styles.fieldLabel}>Ação Corretiva:</Text><Text style={styles.fieldValue}>{laudo.acao}</Text></View>
        </View>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Prazos</Text>
           <View style={styles.fieldContainer}><Text style={styles.fieldLabel}>Data de Início:</Text><Text style={styles.fieldValue}>{dataInicio}</Text></View>
           <View style={styles.fieldContainer}><Text style={styles.fieldLabel}>Data de Fim:</Text><Text style={styles.fieldValue}>{dataFim}</Text></View>
        </View>

        <Text style={styles.footer}>
          Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}.
        </Text>
      </Page>
    </Document>
  );
}

export default LaudoPDF;