import axios from "axios";

export async function getExpense() {
  let res;
  const url = "https://d1-tutorial.a29098477.workers.dev/api";
  await axios
    .get(`${url}/expense`)
    .then(function (response) {
      // handle success
      res = response.data;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
      // console.log("done");
    });
  return res;
}
