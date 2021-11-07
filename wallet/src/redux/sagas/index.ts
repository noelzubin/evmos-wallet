import { all, fork } from "redux-saga/effects";
import MainSaga from "./mainSaga";

export default function* rootSaga() {
  yield all([...MainSaga]);
}
