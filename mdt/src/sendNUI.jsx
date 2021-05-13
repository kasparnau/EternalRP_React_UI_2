const IS_PROD = process.env.NODE_ENV === 'production';

function sendNUI(action, data, mockAnswer) {
  return new Promise((resolve) => {
    if (IS_PROD) {
      fetch(
        `https://${process.env.REACT_APP_RESOURCE_NAME}/nuiAction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            action,
            data,
          }),
        },
      )
        .then((resp) => resp.json())
        .then((resp) => {
          resolve(resp);
        });
    } else {
      setTimeout(() => {
        resolve(mockAnswer);
      }, 100);
    }
  });
}

export default sendNUI;
