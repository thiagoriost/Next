
/**
 * Actualiza el estado de finalización de una tarea mediante la API.
 * @param id Identificador de la tarea que se actualizará.
 * @param completed Nuevo estado de finalización.
 * @returns La respuesta JSON de la API.
 * @throws Propaga los errores ocurridos durante la solicitud.
 */
export const updateTodo = async (id: string, completed: boolean) => {
    console.log("back updateTodo")
  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed })
    }).then(res => res.json());
    
    console.log({response})

    return response;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

/**
 * Crea una tarea mediante la API.
 * @param description Descripción de la tarea.
 * @param title Título de la tarea.
 * @returns La respuesta JSON de la API.
 * @throws Propaga los errores ocurridos durante la solicitud.
 */
export const createTodo = async (description: string, title: string) => {
  try {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description, title })
    }).then(res => res.json());

    console.log({response});

    return response;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};
