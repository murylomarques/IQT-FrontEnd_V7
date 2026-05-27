import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiUpload, FiCheck, FiX, FiCheckCircle, FiAlertTriangle, FiClock } from 'react-icons/fi';
import {
    ItemCard, ItemHeader, ItemIndex, ItemTitle, StatusBadge,
    ItemBody, Label, ObservationText,
    PhotoRow, PhotoCol, ImageLink, ImagePreview, NoPhoto, UploadZone,
    RejectedNote, ApprovedNote,
    ItemFooter, SubmitButton, ApproveButton, ReproveButton,
} from './styles';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';

const STATUS_ICON = {
    'Aprovado':   <FiCheckCircle />,
    'Reprovado':  <FiAlertTriangle />,
    'Em Análise': <FiClock />,
};

const ItemCorrecao = ({ item, index, total, onItemUpdate, isSubmitting }) => {
    const { user } = useAuth();
    const [fotoCorrecao, setFotoCorrecao] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        setFotoCorrecao(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
    }, [item]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFotoCorrecao(file);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmitCorrecao = () => {
        if (!fotoCorrecao) {
            alert('Por favor, anexe a foto da correção.');
            return;
        }
        onItemUpdate(item.id, { foto_correcao: fotoCorrecao, action: 'resolver' });
    };

    const handleAvaliacao = (status) => {
        onItemUpdate(item.id, { status, action: 'avaliar' });
    };

    const baseURL = `${API_BASE_URL}/storage/`;
    const statusCorrecao = item.status_correcao || 'Pendente';
    const isTerceirizado = user.role === 'terceirizado';
    const isAdmin = user.role === 'admin';
    const canSubmit = (isTerceirizado || isAdmin) && statusCorrecao !== 'Em Análise' && statusCorrecao !== 'Aprovado';
    const canReview = isAdmin && statusCorrecao === 'Em Análise';

    return (
        <ItemCard statusCorrecao={statusCorrecao}>
            <ItemHeader>
                <div className="left">
                    <ItemIndex>{index}/{total}</ItemIndex>
                    <ItemTitle>{item.item_key.replace(/_/g, ' ')}</ItemTitle>
                </div>
                <StatusBadge status={statusCorrecao}>
                    {STATUS_ICON[statusCorrecao]}
                    {statusCorrecao}
                </StatusBadge>
            </ItemHeader>

            <ItemBody>
                <Label>Observação do Fiscal</Label>
                <ObservationText>
                    {item.observacao || 'Nenhuma observação registrada.'}
                </ObservationText>

                <PhotoRow>
                    {/* Foto do problema (fiscal) */}
                    <PhotoCol>
                        <Label>Foto do Problema</Label>
                        {item.foto_path ? (
                            <ImageLink href={baseURL + item.foto_path} target="_blank" rel="noopener noreferrer">
                                <ImagePreview src={baseURL + item.foto_path} alt="Foto do Problema" />
                            </ImageLink>
                        ) : (
                            <NoPhoto>Sem foto</NoPhoto>
                        )}
                    </PhotoCol>

                    {/* Foto da correção / upload */}
                    <PhotoCol>
                        <Label>Foto da Correção</Label>
                        {preview ? (
                            <ImageLink as="div">
                                <ImagePreview src={preview} alt="Pré-visualização" />
                            </ImageLink>
                        ) : item.foto_correcao_path && statusCorrecao !== 'Reprovado' ? (
                            <ImageLink href={baseURL + item.foto_correcao_path} target="_blank" rel="noopener noreferrer">
                                <ImagePreview src={baseURL + item.foto_correcao_path} alt="Foto da Correção" />
                            </ImageLink>
                        ) : canSubmit ? (
                            <UploadZone htmlFor={`file-${item.id}`}>
                                <FiUpload />
                                <span>{statusCorrecao === 'Reprovado' ? 'Enviar nova foto' : 'Clique para anexar'}</span>
                                <span className="hint">JPG, PNG, WEBP</span>
                            </UploadZone>
                        ) : (
                            <NoPhoto>Aguardando envio</NoPhoto>
                        )}
                        <input
                            id={`file-${item.id}`}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            hidden
                        />
                    </PhotoCol>
                </PhotoRow>

                {statusCorrecao === 'Reprovado' && (
                    <RejectedNote>
                        <FiAlertTriangle />
                        Correção reprovada. Envie uma nova foto para reavaliação.
                    </RejectedNote>
                )}
            </ItemBody>

            <ItemFooter>
                {statusCorrecao === 'Aprovado' && (
                    <ApprovedNote>
                        <FiCheckCircle /> Item aprovado
                    </ApprovedNote>
                )}

                {canSubmit && (
                    <SubmitButton
                        onClick={handleSubmitCorrecao}
                        disabled={isSubmitting || !fotoCorrecao}
                    >
                        <FiUpload />
                        {isSubmitting ? 'Enviando...' : 'Enviar Correção'}
                    </SubmitButton>
                )}

                {canReview && (
                    <>
                        <ReproveButton onClick={() => handleAvaliacao('Reprovado')} disabled={isSubmitting}>
                            <FiX />
                            Reprovar
                        </ReproveButton>
                        <ApproveButton onClick={() => handleAvaliacao('Aprovado')} disabled={isSubmitting}>
                            <FiCheck />
                            Aprovar
                        </ApproveButton>
                    </>
                )}
            </ItemFooter>
        </ItemCard>
    );
};

export default ItemCorrecao;
