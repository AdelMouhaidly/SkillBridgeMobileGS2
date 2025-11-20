import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { User as UserIcon, Mail, MapPin, LogOut, Edit2, Target, Tag, X, Plus, Info, Trash2 } from 'lucide-react-native';
import { getUser, logout, updateUser, getUserById, deleteUser } from '../services/api';
import { User } from '../types';

const { width } = Dimensions.get('window');

export default function Perfil({ onLogout, navigation }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [competenciaInput, setCompetenciaInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await getUser();
    if (userData) {
      setUser(userData);
      try {
        const fullUser = await getUserById(userData.id);
        setUser(fullUser);
      } catch (error) {
        console.error('Erro ao carregar dados completos:', error);
      }
    }
  };

  const handleEdit = () => {
    if (user) {
      setEditData({
        nome: user.nome,
        telefone: user.telefone || '',
        cidade: user.cidade || '',
        uf: user.uf || '',
        objetivoCarreira: user.objetivoCarreira || '',
        competencias: user.competencias || [],
      });
      setEditing(true);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const updated = await updateUser(user.id, editData);
      setUser(updated);
      setEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error: any) {
      let errorMsg = 'Erro ao atualizar perfil';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      Alert.alert('Erro', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const addCompetencia = () => {
    if (competenciaInput.trim() && !editData.competencias?.includes(competenciaInput.trim())) {
      setEditData(prev => ({
        ...prev,
        competencias: [...(prev.competencias || []), competenciaInput.trim()],
      }));
      setCompetenciaInput('');
    }
  };

  const removeCompetencia = (comp: string) => {
    setEditData(prev => ({
      ...prev,
      competencias: prev.competencias?.filter(c => c !== comp) || [],
    }));
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await deleteUser(user.id);
      await logout();
      if (onLogout) {
        onLogout();
      }
      Alert.alert('Conta Excluída', 'Sua conta foi excluída com sucesso.');
    } catch (error: any) {
      let errorMsg = 'Erro ao excluir conta';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      Alert.alert('Erro', errorMsg);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            onLogout();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerLogoContainer}>
          <Image
            source={require('../images/logoSkillBridge.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.avatar}>
          <UserIcon size={40} color="#fff" />
        </View>
        <Text style={styles.name}>{user?.nome}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Edit2 size={18} color="#2196F3" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Mail size={20} color="#2196F3" />
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>

        {user?.telefone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Telefone:</Text>
            <Text style={styles.infoValue}>{user.telefone}</Text>
          </View>
        )}

        {user?.cidade && (
          <View style={styles.infoRow}>
            <MapPin size={20} color="#2196F3" />
            <Text style={styles.infoValue}>
              {user.cidade}{user.uf ? `, ${user.uf}` : ''}
            </Text>
          </View>
        )}

        {user?.objetivoCarreira && (
          <View style={styles.infoRow}>
            <Target size={20} color="#2196F3" />
            <Text style={styles.infoValue}>{user.objetivoCarreira}</Text>
          </View>
        )}

        {user?.competencias && user.competencias.length > 0 && (
          <View style={styles.competenciasSection}>
            <View style={styles.infoRow}>
              <Tag size={20} color="#2196F3" />
              <Text style={styles.sectionTitle}>Competências</Text>
            </View>
            <View style={styles.competenciasContainer}>
              {user.competencias.map((comp, idx) => (
                <View key={idx} style={styles.competenciaTag}>
                  <Text style={styles.competenciaText}>{comp}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation?.navigate('MinhasAplicacoes')}
      >
        <Text style={styles.actionButtonText}>Minhas Candidaturas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.actionButtonWithIcon]}
        onPress={() => navigation?.navigate('Sobre')}
      >
        <Info size={20} color="#fff" />
        <Text style={styles.actionButtonText}>Sobre o App</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#fff" />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <Modal
        visible={editing}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setEditing(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  value={editData.nome}
                  onChangeText={(text) => setEditData(prev => ({ ...prev, nome: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={editData.telefone}
                  onChangeText={(text) => setEditData(prev => ({ ...prev, telefone: text }))}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Cidade</Text>
                  <TextInput
                    style={styles.input}
                    value={editData.cidade}
                    onChangeText={(text) => setEditData(prev => ({ ...prev, cidade: text }))}
                  />
                </View>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>UF</Text>
                  <TextInput
                    style={styles.input}
                    value={editData.uf}
                    onChangeText={(text) => setEditData(prev => ({ ...prev, uf: text.toUpperCase() }))}
                    maxLength={2}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Objetivo de Carreira</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editData.objetivoCarreira}
                  onChangeText={(text) => setEditData(prev => ({ ...prev, objetivoCarreira: text }))}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Competências</Text>
                <View style={styles.tagInputContainer}>
                  <TextInput
                    style={styles.tagInput}
                    placeholder="Ex: Java, Spring Boot"
                    value={competenciaInput}
                    onChangeText={setCompetenciaInput}
                    onSubmitEditing={addCompetencia}
                  />
                  <TouchableOpacity style={styles.addButton} onPress={addCompetencia}>
                    <Plus size={20} color="#2196F3" />
                  </TouchableOpacity>
                </View>
                <View style={styles.tagsContainer}>
                  {editData.competencias?.map((comp, idx) => (
                    <View key={idx} style={styles.tag}>
                      <Text style={styles.tagText}>{comp}</Text>
                      <TouchableOpacity onPress={() => removeCompetencia(comp)}>
                        <X size={16} color="#666" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.deleteSection}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => setShowDeleteConfirm(true)}
                disabled={loading}
              >
                <Trash2 size={18} color="#f44336" />
                <Text style={styles.deleteButtonText}>Excluir Conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteConfirm}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContent}>
            <View style={styles.confirmModalHeader}>
              <Trash2 size={32} color="#f44336" />
              <Text style={styles.confirmModalTitle}>Excluir Conta</Text>
            </View>
            <Text style={styles.confirmModalText}>
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
            </Text>
            <Text style={styles.confirmModalWarning}>
              Todos os seus dados serão permanentemente removidos.
            </Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity
                style={styles.confirmCancelButton}
                onPress={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                <Text style={styles.confirmCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmDeleteButton, loading && styles.confirmDeleteButtonDisabled]}
                onPress={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmDeleteButtonText}>Excluir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  headerLogoContainer: {
    marginBottom: 20,
  },
  headerLogo: {
    width: width * 0.18,
    height: width * 0.18,
    maxWidth: 70,
    maxHeight: 70,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    gap: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    minWidth: 80,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  competenciasSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  competenciasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  competenciaTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  competenciaText: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonWithIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteSection: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f44336',
    gap: 8,
  },
  deleteButtonText: {
    color: '#f44336',
    fontSize: 15,
    fontWeight: '600',
  },
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  confirmModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  confirmModalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  confirmModalWarning: {
    fontSize: 14,
    color: '#f44336',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 24,
  },
  confirmModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmCancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  confirmCancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmDeleteButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f44336',
    alignItems: 'center',
  },
  confirmDeleteButtonDisabled: {
    opacity: 0.6,
  },
  confirmDeleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
