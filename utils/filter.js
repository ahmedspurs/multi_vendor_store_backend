const getDeletedData = (oldUserRoles, newUserRoles) => {
  const deletedData = [];
  for (const oldObject of oldUserRoles) {
    if (!newUserRoles.some((newObject) => newObject?.id === oldObject?.id)) {
      deletedData.push(oldObject);
    }
  }
  return deletedData;
};

const getAddedData = (oldUserRoles, newUserRoles) => {
  const addedData = [];
  for (const newObject of newUserRoles) {
    if (!oldUserRoles.some((oldObject) => oldObject?.id === newObject?.id)) {
      addedData.push(newObject);
    }
  }
  return addedData;
};

const getUniqueObjects = (mainArray, unwantedArray) => {
  // Create an empty array to store the unique objects.
  let uniqueObjects = [];

  // Iterate over the main array.
  for (let object of mainArray) {
    // Check if the object is not in the unwanted array.
    if (unwantedArray.indexOf(object) === -1) {
      // If the object is not in the unwanted array, add it to the unique objects array.
      uniqueObjects.push(object);
    }
  }

  // Return the unique objects array.
  return uniqueObjects;
};

const getRemainingData = (mainArray, addedData, deletedData) => {
  // Create an empty array to store the remaining data.
  const remainingData = [];

  // Iterate through the main array.
  for (const item of mainArray) {
    // Check if the item is in the addedData or deletedData arrays.
    const isAdded = addedData.includes(item);
    const isDeleted = deletedData.includes(item);

    // If the item is not in either of the arrays, add it to the remainingData array.
    if (!isAdded && !isDeleted) {
      remainingData.push(item);
    }
  }

  // Return the remainingData array.
  return remainingData;
};

module.exports = {
  getDeletedData,
  getAddedData,
  getUniqueObjects,
  getRemainingData,
};
