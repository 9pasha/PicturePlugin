import {TRootNativeStackParamList} from './index';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TRootNativeStackParamList {}
  }
}
