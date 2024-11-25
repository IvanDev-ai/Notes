export const notesData = {
    folder1: {
      name: "Folder 1",
      notes: []
    },
    folder2: {
      name: "Folder 2",
      subfolder: {
        name: "Subfolder 2.1",
        notes: [
          {
            id: 1,
            date: "2024-11-24",
            title: "Nota 1",
            description: "Descripción de la nota 1"
          },
          {
            id: 2,
            date: "2024-11-24",
            title: "Nota 2",
            description: "Descripción de la nota 2"
          }
        ]
      }
    },
    folder3: {
      name: "Folder 3",
      notes: [
        {
          id: 3,
          date: "2024-11-24",
          title: "Nota 3",
          description: "Descripción de la nota 3"
        },
        {
          id: 4,
          date: "2024-11-24",
          title: "Nota 4",
          description: "Descripción de la nota 4"
        },
        {
          id: 5,
          date: "2024-11-24",
          title: "Nota 5",
          description: "Descripción de la nota 5"
        }
      ]
    }
  };

  export const updateNotesData = (newData) => {
    Object.assign(notesData, newData);
  };