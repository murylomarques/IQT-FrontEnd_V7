import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    ItemCard, ItemHeader, ItemSection, Label, ObservationText,
    ImageLink, ImagePreview, Divider, StatusBadge, FileInputContainer,
    FileInputLabel, SubmitButton, ApproveButton, ReproveButton
} from './styles';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';

const ItemCorrecao = ({ item, onItemUpdate, isSubmitting }) => {
    const { user } = useAuth();
    const [fotoCorrecao, setFotoCorrecao] = useState(null);
    const [preview, setPreview] = useState(null);

    // Limpa o preview quando o item muda (após um update)
    useEffect(() => {
        setFotoCorrecao(null);
        setPreview(null);
    }, [item]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFotoCorrecao(file);
            // Limpa o preview antigo antes de criar um novo
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmitCorrecao = () => {
        if (!fotoCorrecao) {
            alert("Por favor, anexe a foto da correção.");
            return;
        }
        onItemUpdate(item.id, { foto_correcao: fotoCorrecao, action: 'resolver' });
    };

    const handleAvaliacao = (status) => {
        onItemUpdate(item.id, { status, action: 'avaliar' });
    };

    const baseURL = `${API_BASE_URL}/storage/`;

    return (
        <ItemCard>
            <ItemHeader>{item.item_key.replace(/_/g, ' ')}</ItemHeader>
            
            <ItemSection>
                <Label>Observação do Fiscal:</Label>
                <ObservationText>{item.observacao || 'Nenhuma.'}</ObservationText>
            </ItemSection>

            {item.foto_path && (
                <ItemSection>
                    <Label>Foto do Problema:</Label>
                    <ImageLink href={baseURL + item.foto_path} target="_blank" rel="noopener noreferrer">
                        <ImagePreview src={baseURL + item.foto_path} alt="Foto do Problema" />
                    </ImageLink>
                </ItemSection>
            )}

            <Divider />

            {/* Lógica de renderização baseada no cargo do usuário */}
            
            {/* Visão do Terceirizado */}
            {(user.role === 'terceirizado' || user.role === 'admin') && (
                <div>
                    <Label>Status da Correção:</Label>
                    <StatusBadge status={item.status_correcao}>{item.status_correcao}</StatusBadge>
                    {item.status_correcao === 'Reprovado' && <p style={{color: 'red', fontWeight: 500}}>Sua correção foi reprovada. Por favor, envie uma nova foto.</p>}
                    
                    {/* Input de arquivo e preview */}
                    <FileInputContainer>
                        <FileInputLabel htmlFor={`file-input-${item.id}`}>
                            Selecionar Foto da Correção
                        </FileInputLabel>
                        <input id={`file-input-${item.id}`} type="file" accept="image/*" onChange={handleFileChange} hidden />
                    </FileInputContainer>
                    
                    {preview && <ImagePreview src={preview} alt="Pré-visualização da Correção" style={{ marginTop: '1rem' }} />}

                    {/* Botão de Enviar Correção */}
                    <div style={{marginTop: '1.5rem'}}>
                        <SubmitButton onClick={handleSubmitCorrecao} disabled={isSubmitting || !fotoCorrecao || item.status_correcao === 'Em Análise'}>
                            {isSubmitting ? 'Enviando...' : 'Enviar Correção'}
                        </SubmitButton>
                    </div>
                </div>
            )}
            
            <Divider />

            {/* Visão do Admin */}
            {user.role === 'admin' && (
                 <div>
                    <Label>Avaliação do Administrador</Label>
                    {item.foto_correcao_path ? (
                        <ItemSection>
                            <Label>Foto da Correção Enviada:</Label>
                             <ImageLink href={baseURL + item.foto_correcao_path} target="_blank" rel="noopener noreferrer">
                                <ImagePreview src={baseURL + item.foto_correcao_path} alt="Foto da Correção" />
                            </ImageLink>
                        </ItemSection>
                    ) : <p>Aguardando envio da foto de correção pelo terceirizado.</p>}
                    
                    {item.status_correcao === 'Em Análise' && (
                        <div style={{marginTop: '1rem'}}>
                            <ApproveButton onClick={() => handleAvaliacao('Aprovado')} disabled={isSubmitting}>Aprovar</ApproveButton>
                            <ReproveButton onClick={() => handleAvaliacao('Reprovado')} disabled={isSubmitting}>Reprovar</ReproveButton>
                        </div>
                    )}
                </div>
            )}
        </ItemCard>
    );
};

export default ItemCorrecao;