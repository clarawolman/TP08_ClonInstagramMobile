// ─────────────────────────────────────────────────────────────
// ProfileScreen.js — Perfil de usuario emulado
// Atribución IA (ver REFLEXION.md e HISTORIAL-IA.md):
//   · IA: resolvió la grilla de 3 columnas con FlatList numColumns={3}
//     calculando ITEM_SIZE = ancho / 3 para que no desborde.
//   · Yo: armé la cabecera del perfil (avatar, métricas, bio, botones
//     Editar/Compartir) y usé Pressable en la grilla para demostrar
//     los dos componentes táctiles (Pressable + TouchableOpacity).
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { obtenerGatos } from '../api/catApi';
import { usuarioActual, leyendas, tiempos, comentariosEjemplo } from '../data/userData';

// El ancho de cada celda es 1/3 del ancho de pantalla -> grilla simétrica
const CONTAINER_WIDTH = Platform.OS === 'web' ? 390 : Dimensions.get('window').width;
const ITEM_SIZE = CONTAINER_WIDTH / 3;

function construirPost(img, i) {
  return {
    id: img.id || `pp-${i}`,
    imagenUrl: img.url,
    autorUsername: usuarioActual.username,
    autorAvatar: usuarioActual.avatar,
    leyenda: leyendas[i % leyendas.length],
    ubicacion: 'Buenos Aires, Argentina',
    likes: Math.floor(Math.random() * 5000) + 100,
    comentarios: comentariosEjemplo.slice(0, 2).map((c) => ({ ...c })),
    tiempo: tiempos[i % tiempos.length],
  };
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [tabActiva, setTabActiva] = useState('publicaciones');

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

  // Cabecera del perfil (va como ListHeaderComponent de la grilla)
  const ListHeader = () => (
    <View>
      {/* Info del perfil: avatar + métricas dinámicas */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarRing}>
          <Image source={{ uri: usuarioActual.avatar }} style={styles.avatar} />
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{publicaciones.length || usuarioActual.postsCount}</Text>
            <Text style={styles.statLabel}>publicaciones</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{usuarioActual.followers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>seguidores</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{usuarioActual.following}</Text>
            <Text style={styles.statLabel}>seguidos</Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      <View style={styles.bio}>
        <Text style={styles.bioName}>{usuarioActual.name}</Text>
        <Text style={styles.bioText}>{usuarioActual.bio}</Text>
      </View>

      {/* Botones: Editar perfil / Compartir perfil */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.editBtn}>
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

  // Cada celda de la grilla usa Pressable (con feedback de opacidad al tocar)
  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.gridItem, pressed && styles.gridItemPressed]}
      onPress={() => navigation.navigate('PostDetail', { post: item })}
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
});
