import api from '@/store/api';
import i18n from '@/i18n';

const RemoteLogsStore = {
  namespaced: true,
  state: {
    allRemoteLogs: [],
  },
  getters: {
    allRemoteLogs: (state) => state.allRemoteLogs,
  },
  mutations: {
    setRemoteLogs(state, remoteLogs) {
      state.allRemoteLogs = remoteLogs;
    },
  },
  actions: {
    async getRemoteLogs({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system/LogServices/EventLog/Remote/Entries')
        .then(({ data: { Members = [] } = {} }) => {
          const remoteLogs = Members.map((data) => {
            const {
              Id,
              Severity,
              Substr,
              EntryType,
              Server,
              ServerPort,
              ConnType,
            } = data;
            return {
              id: Id,
              location: data['@odata.id'],
              severity: Severity,
              type: EntryType,
              substr: Substr,
              server: Server,
              serverPort: ServerPort,
              connType: ConnType,
            };
          });
          commit('setRemoteLogs', remoteLogs);
        })
        .catch((error) => {
          console.log('Remote Logs Data:', error);
        });
    },
    async addNewRemoteLog(
      { dispatch },
      { severity, substr, server, serverPort, connType }
    ) {
      const data = {};
      data.Severity = severity;
      data.Substr = substr;
      data.Server = server;
      data.ServerPort = serverPort;
      data.ConnType = connType;

      return await api
        .patch(
          '/redfish/v1/Systems/system/LogServices/EventLog/Remote/Entries/0',
          data
        )
        .then(() => dispatch('getRemoteLogs'))
        .then(() =>
          i18n.t('pageRemoteLogs.toast.successAddRemoteLog', {
            server: server,
            serverPort: serverPort,
          })
        )
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageRemoteLogs.toast.errorAddRemoteLog'));
        });
    },
    async updateRemoteLog(
      { dispatch },
      { severity, substr, server, serverPort, connType, location }
    ) {
      const data = {};
      data.Severity = severity;
      data.Substr = substr;
      data.Server = server;
      data.ServerPort = serverPort;
      data.ConnType = connType;

      return await api
        .patch(location, data)
        .then(() => dispatch('getRemoteLogs'))
        .then(() =>
          i18n.t('pageRemoteLogs.toast.successUpdateRemoteLog', {
            server: server,
            serverPort: serverPort,
          })
        )
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageRemoteLogs.toast.errorUpdateRemoteLog'));
        });
    },
    async deleteRemoteLog({ dispatch }, { server, serverPort, location }) {
      return await api
        .delete(location)
        .then(() => dispatch('getRemoteLogs'))
        .then(() =>
          i18n.t('pageRemoteLogs.toast.successDeleteRemoteLog', {
            server: server,
            serverPort: serverPort,
          })
        )
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageRemoteLogs.toast.errorDeleteRemoteLog'));
        });
    },
  },
};

export default RemoteLogsStore;
