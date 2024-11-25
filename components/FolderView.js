import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const FolderView = ({ folders, navigateToFolder, goBackToRoot, addNoteHere, addFolder, currentFolder }) => {
  return (
    <ScrollView style={styles.folderScrollView}>
      {currentFolder === null ? (
        // Si no hay ninguna carpeta seleccionada, mostrar las carpetas principales
        Object.keys(folders).map((folderName) => (
          <TouchableOpacity
            key={folderName}
            style={styles.folderItem}
            onPress={() => navigateToFolder(folderName)}
          >
            <Text style={styles.folderText}>{folders[folderName].name}</Text>
          </TouchableOpacity>
        ))
      ) : (
        // Si hay una carpeta seleccionada, mostrar su contenido
        <>
          <TouchableOpacity style={styles.folderItem} onPress={goBackToRoot}>
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
              <Text style={styles.folderText}>{folders[currentFolder].subfolder.name}</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      {/* Agregar el botón "Agregar aquí" */}
      <TouchableOpacity style={styles.folderItem} onPress={addNoteHere}>
        <Text style={styles.folderText}>Agregar aquí</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.folderItem}
        onPress={() => addFolder(prompt('Ingrese el nombre de la nueva carpeta'))}
      >
        <Text style={styles.folderText}>+ Crear nueva carpeta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  folderScrollView: {
    flex: 1,
    width: '100%',
  },
  folderItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'rgba(58,58,58,0.7)',
    borderRadius: 10,
  },
  folderText: {
    color: 'white',
    fontSize: 18,
  },
});

export default FolderView;
