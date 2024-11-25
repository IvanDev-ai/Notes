import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { notesData } from "../data/notes";
import { Ionicons } from "@expo/vector-icons";

export default function JournalScreen() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [noteData, setNoteData] = useState(notesData);
  const [subfolders, setSubfolders] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [folderNameInput, setFolderNameInput] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const handleSelectFolder = (folder) => {
    setSelectedFolder(folder.name);
    setNoteData(folder.notes || []);
    setEditFolderName(folder.name);
    setSelectedNote(null);
    if (folder.subfolder) {
      setSubfolders([folder.subfolder]);
    } else {
      setSubfolders([]);
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  const handleEditFolderName = (folderName) => {
    const updatedFolders = noteData.map((folder) =>
      folder.name === folderName ? { ...folder, name: newFolderName } : folder
    );
    setNoteData(updatedFolders);
    setNewFolderName(""); // Limpiar el campo de nombre después de editar
  };

  const handleEditNoteName = (newTitle) => {
    setSelectedNote((prevNote) => ({
      ...prevNote,
      title: newTitle,
    }));
  };

  const handleEditNoteDescription = (newDescription) => {
    setSelectedNote((prevNote) => ({
      ...prevNote,
      description: newDescription,
    }));
  };

  const handleDeleteFolder = (folderName) => {
    Alert.alert(
      "Confirmación",
      `¿Estás seguro de que quieres eliminar la carpeta "${folderName}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            // Verificar el estado actual de noteData antes de la eliminación
            console.log("Contenido de noteData antes de la eliminación:", noteData);
            
            // Buscar la clave que coincide con el nombre de la carpeta
            const folderKey = Object.keys(noteData).find(
              (key) => noteData[key].name === folderName
            );
  
            // Verificar si la carpeta existe antes de eliminarla
            if (folderKey) {
              const updatedNoteData = { ...noteData }; // Copiar el objeto noteData
              delete updatedNoteData[folderKey]; // Eliminar la carpeta usando la clave correcta
              console.log("Carpeta eliminada:", folderName);
              
              // Actualizamos el estado con la nueva estructura
              setNoteData(updatedNoteData);
  
              // Si la carpeta seleccionada es la que estamos eliminando, deseleccionarla
              if (selectedFolder && selectedFolder === folderName) {
                setSelectedFolder(null);
              }
  
              // Verificar el estado de noteData después de la eliminación
              console.log("Estado de noteData después de la eliminación:", updatedNoteData);
            } else {
              console.log("No se encontró la carpeta:", folderName);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  
  
  
  

  const handleDeleteNote = (noteId) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que quieres eliminar esta nota?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            setNoteData(noteData.filter((note) => note.id !== noteId));
            if (selectedNote && selectedNote.id === noteId) {
              setSelectedNote(null);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleCreateFolder = () => {
    Alert.alert(
      "Crear Carpeta",
      "Introduce el nombre para la nueva carpeta:",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Crear",
          onPress: () => {
            if (folderNameInput.trim() === "") {
              Alert.alert(
                "Error",
                "El nombre de la carpeta no puede estar vacío"
              );
              return;
            }
            const newFolder = {
              name: folderNameInput,
              notes: [],
            };
            setNoteData((prevData) => [...prevData, newFolder]);
            setFolderNameInput(""); // Limpiar el campo de nombre
          },
        },
      ],
      {
        cancelable: false,
        input: (
          <TextInput
            style={styles.textInput}
            placeholder="Nombre de la carpeta"
            value={folderNameInput}
            onChangeText={setFolderNameInput}
          />
        ),
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>
        {selectedNote
          ? selectedNote.title
          : selectedFolder
          ? selectedFolder
          : "Carpetas"}
      </Text>

      {!selectedFolder && !selectedNote ? (
        <ScrollView style={styles.folderList}>
          {Object.keys(notesData).map((folderKey) => {
            const folder = notesData[folderKey];
            return (
              <View key={folderKey} style={styles.folderItemContainer}>
                <TouchableOpacity
                  style={styles.folderItem}
                  onPress={() => handleSelectFolder(folder)}
                >
                  <Ionicons name="folder" size={24} color="white" />
                  <Text style={styles.folderText}>{folder.name}</Text>
                </TouchableOpacity>
                <View style={styles.folderActionsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setNewFolderName(folder.name)} // Activar el campo de edición
                  >
                    <Ionicons name="create" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteFolder(folder.name)}
                  >
                    <Ionicons name="trash-bin" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                {newFolderName === folder.name && (
                  <TextInput
                    style={styles.textInput}
                    value={newFolderName}
                    onChangeText={setNewFolderName}
                    placeholder="Nuevo nombre de carpeta"
                    onSubmitEditing={() => handleEditFolderName(folder.name)} // Editar el nombre
                  />
                )}
              </View>
            );
          })}
          <TouchableOpacity
            style={styles.createFolderButton}
            onPress={handleCreateFolder}
          >
            <Ionicons name="add-circle" size={24} color="white" />
            <Text style={styles.createFolderText}>Crear Carpeta Aquí</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.notesContainer}>
          {selectedNote ? (
            <View style={styles.noteDetailContainer}>
              <TextInput
                style={styles.noteTitleInput}
                value={selectedNote.title}
                onChangeText={handleEditNoteName}
              />
              <TextInput
                style={styles.textInput}
                value={selectedNote.description}
                onChangeText={handleEditNoteDescription}
                multiline
              />
            </View>
          ) : (
            <ScrollView style={styles.notesList}>
              {noteData.length > 0 ? (
                noteData.map((note) => (
                  <View key={note.id} style={styles.noteItemContainer}>
                    <TouchableOpacity onPress={() => handleSelectNote(note)}>
                      <View style={styles.noteItem}>
                        <Ionicons name="document" size={24} color="white" />
                        <Text style={styles.noteTitle}>{note.title}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteNote(note.id)}
                    >
                      <Ionicons name="trash-bin" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noNotesText}>
                  No hay notas en esta carpeta.
                </Text>
              )}

              {subfolders.length > 0 && (
                <View style={styles.subfoldersContainer}>
                  {subfolders.map((subfolder, index) => (
                    <View key={index} style={styles.folderItemContainer}>
                      <TouchableOpacity
                        style={styles.folderItem}
                        onPress={() => handleSelectFolder(subfolder)}
                      >
                        <Ionicons name="folder" size={24} color="white" />
                        <Text style={styles.folderText}>
                          Subcarpeta: {subfolder.name}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteFolder(subfolder.name)}
                      >
                        <Ionicons name="trash-bin" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setSelectedFolder(null);
              setNoteData([]);
              setSubfolders([]);
              setSelectedNote(null);
            }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131316",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "white",
  },
  folderList: {
    flex: 1,
  },
  folderItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  folderItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(58,58,58,0.7)",
    borderRadius: 8,
    flex: 1,
  },
  folderText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "white",
  },
  notesContainer: {
    flex: 1,
  },
  noteDetailContainer: {
    marginBottom: 20,
  },
  noteTitleInput: {
    fontSize: 24,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    color: "white",
  },
  textInput: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
    minHeight: 80,
    fontSize: 16,
    color: "white",
  },
  notesList: {
    flex: 1,
  },
  noteItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(58,58,58,0.7)",
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  noNotesText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  subfoldersContainer: {
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "rgba(255,0,0,0.7)",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  createFolderButton: {
    backgroundColor: "rgba(58,58,58,0.7)",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  createFolderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(58,58,58,0.7)",
    borderRadius: 8,
    marginBottom: "30%",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginLeft: 10,
  },
  folderActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "rgba(0,0,255,0.7)",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
