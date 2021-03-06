import {
  call,
  put,
  takeEvery,
} from 'redux-saga/effects';

import addLiquidity from '../../api/addLiquidity';
import removeLiquidity from '../../api/removeLiquidity';
import swapTokens from '../../api/swapTokens';
import { setGlobalErrorDispatch } from '../error/globalErrorActions';
import { submitConnectWalletForm } from '../walletStore/walletConnectActions';

import { setSwapFormError, setSwapFormSubmitting, setSwapFormSuccess } from './swapFormActions';
import { SagaSwapFormType, SUBMIT_SWAP_FORM } from './Types';

function* workerSwapFormSaga(data: SagaSwapFormType) {
  const { payload } = data;
  const {
    fromTokenValue,
    toTokenValue,
    fromTokenIndex,
    toTokenIndex,
    provider,
    signer,
    balanceToRemove,
  } = payload;
  yield put(setGlobalErrorDispatch({ globalErrorMessage: '' }));
  if (payload.type === 'add') {
    if (!fromTokenIndex.adress || !toTokenIndex.adress) {
      yield put(submitConnectWalletForm(true));
    }
    yield put(setSwapFormError(false));
    yield put(setSwapFormSuccess(false));
    yield put(setSwapFormSubmitting(true));
    const result: Error | undefined = yield call(async () => addLiquidity(
      fromTokenValue,
      toTokenValue,
      fromTokenIndex?.adress,
      toTokenIndex?.adress,
      provider,
      signer,
    ));
    if (result?.constructor.name === 'Error') {
      yield put(setSwapFormSuccess(false));
      yield put(setSwapFormError(true));
      yield put(setGlobalErrorDispatch({ globalErrorMessage: String(result.message) }));
    } else {
      yield put(setSwapFormSuccess(true));
      yield put(setSwapFormError(false));
    }
    yield put(setSwapFormSubmitting(false));
  } else if (payload.type === 'get') {
    if (!fromTokenIndex.adress || !toTokenIndex.adress) {
      yield put(submitConnectWalletForm(true));
    }
    yield put(setGlobalErrorDispatch({ globalErrorMessage: '' }));
    yield put(setSwapFormError(false));
    yield put(setSwapFormSuccess(false));
    yield put(setSwapFormSubmitting(true));
    const result: Error | undefined = yield call(async () => removeLiquidity(
      fromTokenIndex?.adress,
      toTokenIndex?.adress,
      balanceToRemove,
      signer,
    ));
    if (result?.constructor.name === 'Error') {
      yield put(setSwapFormError(true));
      yield put(setSwapFormSuccess(false));
      yield put(setGlobalErrorDispatch({ globalErrorMessage: String(result.message) }));
    } else {
      yield put(setSwapFormSuccess(true));
      yield put(setSwapFormError(true));
    }
    yield put(setSwapFormSubmitting(false));
  } else {
    yield put(setSwapFormSubmitting(true));
    yield put(setSwapFormError(false));
    if (payload.provider && payload.signer) {
      const result: Error | undefined = yield call(async () => swapTokens(
        payload.fromTokenIndex?.adress,
        payload.toTokenIndex?.adress,
        payload.signer,
        payload.provider,
        String(payload.fromTokenValue),
        String(payload.toTokenValue),
      ));
      if (result && result.constructor.name === 'Error') {
        yield put(setGlobalErrorDispatch({ globalErrorMessage: String(result.message) }));
        yield put(setSwapFormError(true));
        yield put(setSwapFormSuccess(false));
      } else {
        yield put(setSwapFormError(false));
        yield put(setSwapFormSuccess(true));
      }
    }
    yield put(setSwapFormSubmitting(false));
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function* watchSwapFormSaga() {
  yield takeEvery(SUBMIT_SWAP_FORM, workerSwapFormSaga);
}

export default watchSwapFormSaga;
