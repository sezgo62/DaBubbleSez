- wie ich die ID eines Dokuments bekomme bevor ich ein Element im Firestore abspeichere. 

const newUserRef = doc(this.getUsers());  // Erstellt eine neue Dokumentreferenz mit einer eindeutigen ID
user.id = newUserRef.id;  // Setzt die ID des User-Objekts auf die ID der neuen Dokumentreferenz