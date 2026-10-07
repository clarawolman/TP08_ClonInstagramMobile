// ProfileScreen.js — Perfil de usuario emulado
// IA: resolvió la grilla de 3 columnas con FlatList numColumns={3}
// calculando ITEM_SIZE = ancho / 3 para que no desborde, y sumó Pressable en la grilla para demostrar
// los dos componentes táctiles (Pressable + TouchableOpacity).
// Nosotros: armamos la cabecera del perfil (avatar, métricas, bio, botones Editar/Compartir) 
import { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { obtenerGatos } from '../api/catApi';
import { leyendas, tiempos, comentariosEjemplo } from '../data/userData';
import { UsuarioContext } from '../context/UsuarioContext';

const CONTAINER_WIDTH = Platform.OS === 'web' ? 390 : Dimensions.get('window').width;
const ITEM_SIZE = CONTAINER_WIDTH / 3;

function construirPost(img, i) {
  return {
    id: img.id || `pp-${i}`,
    imagenUrl: img.url,
    leyenda: leyendas[i % leyendas.length],
    ubicacion: 'Buenos Aires, Argentina',
    likes: Math.floor(Math.random() * 5000) + 100,
    comentarios: comentariosEjemplo.slice(0, 2).map((c) => ({ ...c })),
    tiempo: tiempos[i % tiempos.length],
  };
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { usuario, setUsuario } = useContext(UsuarioContext);
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [tabActiva, setTabActiva] = useState('publicaciones');
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState(usuario);

  const abrirEdicion = () => {
    setForm(usuario);
    setEditando(true);
  };

  const guardarPerfil = () => {
    setUsuario({ ...usuario, username: form.username.trim() || usuario.username, name: form.name, bio: form.bio });
    setEditando(false);
  };

  useEffect(() => {
    async function cargarPublicaciones() {
      try {
        const imagenes = await obtenerGatos(12);
        setPublicaciones(imagenes.map((img, i) => construirPost(img, i)));
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    }
    cargarPublicaciones();
  }, []);

  const ListHeader = () => (
    <View>
      {/* Info del perfil: avatar + métricas dinámicas */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarRing}>
          <Image source={{ uri: usuario.avatar }} style={styles.avatar} />
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{publicaciones.length || usuario.postsCount}</Text>
            <Text style={styles.statLabel}>publicaciones</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{usuario.followers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>seguidores</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{usuario.following}</Text>
            <Text style={styles.statLabel}>seguidos</Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      <View style={styles.bio}>
        <Text style={styles.bioName}>{usuario.name}</Text>
        <Text style={styles.bioText}>{usuario.bio}</Text>
      </View>

      {/* Botones: Editar perfil / Compartir perfil */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.editBtn} onPress={abrirEdicion}>
          <Text style={styles.editBtnText}>Editar perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={styles.editBtnText}>Compartir perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="person-add-outline" size={16} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs: publicaciones / etiquetados */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tabActiva === 'publicaciones' && styles.tabActiva]}
          onPress={() => setTabActiva('publicaciones')}
        >
          <Ionicons
            name="grid-outline"
            size={22}
            color={tabActiva === 'publicaciones' ? '#000' : '#888'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tabActiva === 'etiquetados' && styles.tabActiva]}
          onPress={() => setTabActiva('etiquetados')}
        >
          <Ionicons
            name="pricetag-outline"
            size={22}
            color={tabActiva === 'etiquetados' ? '#000' : '#888'}
          />
        </TouchableOpacity>
      </View>

      {cargando && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.gridItem, pressed && styles.gridItemPressed]}
      onPress={() =>
        navigation.navigate('PostDetail', {
          post: { ...item, autorUsername: usuario.username, autorAvatar: usuario.avatar },
        })
      }
    >
      <Image source={{ uri: item.imagenUrl }} style={styles.gridImage} resizeMode="cover" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Grilla de 3 columnas con FlatList numColumns={3} */}
      <FlatList
        data={publicaciones}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={3}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={editando} transparent animationType="slide" onRequestClose={() => setEditando(false)}>
        <View style={styles.modalFondo}>
          <View style={styles.modalCaja}>
            <Text style={styles.modalTitulo}>Editar perfil</Text>
            <Text style={styles.modalLabel}>Usuario</Text>
            <TextInput
              style={styles.modalInput}
              value={form.username}
              onChangeText={(texto) => setForm({ ...form, username: texto })}
              autoCapitalize="none"
            />
            <Text style={styles.modalLabel}>Nombre</Text>
            <TextInput
              style={styles.modalInput}
              value={form.name}
              onChangeText={(texto) => setForm({ ...form, name: texto })}
            />
            <Text style={styles.modalLabel}>Presentación</Text>
            <TextInput
              style={[styles.modalInput, styles.modalInputBio]}
              value={form.bio}
              onChangeText={(texto) => setForm({ ...form, bio: texto })}
              multiline
            />
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.editBtn} onPress={() => setEditando(false)}>
                <Text style={styles.editBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.editBtn, styles.guardarBtn]} onPress={guardarPerfil}>
                <Text style={[styles.editBtnText, styles.guardarBtnText]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#c13584',
    padding: 3,
    marginRight: 24,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    backgroundColor: '#f0f0f0',
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNum: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#000',
  },
  bio: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  bioName: {
    fontWeight: '700',
    fontSize: 14,
    color: '#000',
    marginBottom: 2,
  },
  bioText: {
    fontSize: 13,
    color: '#000',
    lineHeight: 18,
  },
  buttons: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 14,
    gap: 8,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#efefef',
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  shareBtn: {
    flex: 1,
    backgroundColor: '#efefef',
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  iconBtn: {
    backgroundColor: '#efefef',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontWeight: '600',
    fontSize: 13,
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#dbdbdb',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tabActiva: {
    borderBottomColor: '#000',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  gridItemPressed: {
    opacity: 0.7,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCaja: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  modalTitulo: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 12,
    color: '#888',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 0.5,
    borderColor: '#dbdbdb',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  modalInputBio: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  guardarBtn: {
    backgroundColor: '#0095f6',
  },
  guardarBtnText: {
    color: '#fff',
  },
});
