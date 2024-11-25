import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { notesData, updateNotesData } from "../data/notes";
import { BlurView } from "expo-blur";

export default function NotesTab() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDesc, setNoteDesc] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null); // Nueva variable para la carpeta actual

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    setFolders(notesData);
    setNotes([]); // Limpiar las notas al cargar nuevas carpetas
    setCurrentFolder(null); // Volver al inicio (sin carpeta seleccionada)
  };

  const [fontsLoaded] = useFonts({
    MyCustomFont: require("../assets/fonts/SFBold.otf"),
  });

  const addNote = (folderName) => {
    if (noteTitle.length > 0 && noteDesc.length > 0) {
      const newNote = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        title: noteTitle,
        description: noteDesc,
      };
      // Agregar la nota a la carpeta seleccionada
      const updatedFolders = { ...folders };
      if (currentFolder) {
        updatedFolders[currentFolder].notes.push(newNote);
      } else {
        // Si estamos en la raíz, agregarla a la carpeta correspondiente
        if (folderName in updatedFolders) {
          updatedFolders[folderName].notes.push(newNote);
        }
      }
      setFolders(updatedFolders);
      setNotes([...notes, newNote]);
      setNoteTitle("");
      setNoteDesc("");
      setModalVisible(false);
    }
  };

  const handleSaveButtonPress = () => {
    if (noteTitle.length > 0 && noteDesc.length > 0) {
      setModalVisible(true);
    } else {
      Alert.alert(
        "Error",
        "Por favor, complete tanto el título como la descripción de la nota."
      );
    }
  };

  const navigateToFolder = (folderName) => {
    setCurrentFolder(folderName); // Actualizar la carpeta actual para mostrar su contenido
  };

  const goBackToRoot = () => {
    setCurrentFolder(null); // Volver a la raíz (mostrar todas las carpetas)
  };

  const addNoteHere = () => {
    if (noteTitle.length > 0 && noteDesc.length > 0) {
      const newNote = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        title: noteTitle,
        description: noteDesc,
      };
  
      if (currentFolder) {
        const folder = notesData[currentFolder];
  
        // Si la carpeta tiene 'notes', agregamos la nueva nota
        if (folder.notes) {
          folder.notes.push(newNote);
        } else {
          folder.notes = [newNote]; // Si no tiene notas, inicializamos el array
        }
  
        // Si la carpeta tiene subcarpeta, agregar la nota ahí también
        if (folder.subfolder) {
          const subfolder = folder.subfolder;
  
          if (subfolder.notes) {
            subfolder.notes.push(newNote);
          } else {
            subfolder.notes = [newNote]; // Inicializamos en caso de no tener notas
          }
        }
  
        // Actualizamos el objeto `notesData` directamente con el nuevo estado
        updateNotesData(notesData);
      } else {
        // Si no estamos en una subcarpeta, agregar la nueva nota a todas las carpetas
        Object.keys(notesData).forEach((folderName) => {
          const folder = notesData[folderName];
          if (folder.notes) {
            folder.notes.push(newNote); // Agregar la nueva nota
          } else {
            folder.notes = [newNote]; // Inicializamos en caso de no tener notas
          }
        });
  
        // Actualizamos el objeto `notesData` directamente con el nuevo estado
        updateNotesData(notesData);
      }
  
      // Actualizar la UI con la nueva nota
      setNotes([...notes, newNote]);
      setNoteTitle("");
      setNoteDesc("");
      setModalVisible(false);
    } else {
      Alert.alert(
        "Error",
        "Por favor, complete tanto el título como la descripción de la nota."
      );
    }
  };
  
  

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.MainContainer}>
          <TextInput
            style={styles.inputTitle}
            placeholder="Nueva Nota"
            placeholderTextColor="#c1c1c1"
            value={noteTitle}
            onChangeText={setNoteTitle}
          />
          <TextInput
            style={styles.inputDesc}
            placeholder="Escribiendo nota..."
            placeholderTextColor="#616161"
            multiline={true}
            numberOfLines={4}
            value={noteDesc}
            onChangeText={setNoteDesc}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveButtonPress}
          >
            <Ionicons
              size={40}
              color="white"
              name="return-down-back"
            ></Ionicons>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <BlurView intensity={40} style={styles.overlay} />
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Seleccione una carpeta</Text>
            <ScrollView style={styles.folderList}>
              {currentFolder === null ? (
                // Si no hay ninguna carpeta seleccionada, mostrar las carpetas principales
                Object.keys(folders).map((folderName) => (
                  <TouchableOpacity
                    key={folderName}
                    style={styles.folderItem}
                    onPress={() => navigateToFolder(folderName)}
                  >
                    <Text style={styles.folderText}>
                      {folders[folderName].name}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                // Si hay una carpeta seleccionada, mostrar su contenido
                <>
                  <TouchableOpacity
                    style={styles.folderItem}
                    onPress={goBackToRoot}
                  >
                    <Text style={styles.folderText}>← Volver a las carpetas</Text>
                  </TouchableOpacity>
                  {folders[currentFolder].notes?.map((note) => (
                    <View key={note.id} style={styles.folderItem}>
                      <Text style={styles.folderText}>{note.title}</Text>
                    </View>
                  ))}
                  {folders[currentFolder].subfolder && (
                    <TouchableOpacity
                      style={styles.folderItem}
                      onPress={() => navigateToFolder(folders[currentFolder].subfolder.name)}
                    >
                      <Text style={styles.folderText}>
                        {folders[currentFolder].subfolder.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
              {/* Agregar el botón "Agregar aquí" */}
              <TouchableOpacity
                style={styles.folderItem}
                onPress={addNoteHere}
              >
                <Text style={styles.folderText}>Agregar aquí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.folderItem}
                onPress={() =>
                  addFolder(prompt("Ingrese el nombre de la nueva carpeta"))
                }
              >
                <Text style={styles.folderText}>+ Crear nueva carpeta</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131316",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  MainContainer: {
    paddingTop: "5%",
    alignItems: "center",
    width: "90%",
    height: "50%",
    borderRadius: 50,
    backgroundColor: "rgba(58,58,58,0.7)",
  },
  inputTitle: {
    width: "90%",
    marginBottom: 10,
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    padding: 10,
    fontFamily: "MyCustomFont",
  },
  inputDesc: {
    width: "90%",
    height: "50%",
    fontSize: 18,
    color: "white",
    padding: 10,
    textAlignVertical: "top",
    fontFamily: "MyCustomFont",
  },
  saveButton: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "flex-end",
    marginTop: 20,
  },
  accessNotes: {
    width: "50%",
    paddingVertical: 5,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 30,
    backgroundColor: "rgba(58,58,58,0.7)",
  },
  modalView: {
    top: "20%",
    margin: 20,
    backgroundColor: "rgba(58,58,58,0.7)",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    color: "white",
    fontFamily: "MyCustomFont",
  },
  folderList: {
    width: "100%",
  },
  folderItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "rgba(58,58,58,0.7)",
    borderRadius: 10,
  },
  folderText: {
    color: "white",
    fontSize: 18,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});