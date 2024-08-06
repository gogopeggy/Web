import axios from "axios";

export async function getExpense() {
  let res;
  const url = "https://d1-tutorial.a29098477.workers.dev/api";
  await axios
    .get(`${url}/expense`)
    .then(function (response) {
      res = response.data;
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      console.log("done");
    });
  return res;
}

export async function crud(path, data, remove) {
  const url = "https://d1-tutorial.a29098477.workers.dev/api";
  if (remove) {
    await axios
      .delete(`${url}${path}`, {
        data: {
          data,
        },
      })
      .then(function (response) {
        console.log("res", response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        console.log("done");
      });
  } else {
    await axios
      .post(`${url}${path}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        console.log("res", response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        console.log("done");
      });
  }
}
