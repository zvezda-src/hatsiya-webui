import api from '@/store/api';
import i18n from '@/i18n';

const RemoteSNMPLogsStore = {
  namespaced: true,
  state: {
    allRemoteSNMPLogs: [],
  },
  getters: {
    allRemoteSNMPLogs: (state) => state.allRemoteSNMPLogs,
  },
  mutations: {
    setRemoteSNMPLogs(state, remoteSNMPLogs) {
      state.allRemoteSNMPLogs = remoteSNMPLogs;
    },
  },
  actions: {
    async getRemoteSNMPLogs({ commit }) {
      return await api
        .get(
          '/redfish/v1/Systems/system/LogServices/EventLog/Remote/SNMP/Entries'
        )
        .then(({ data: { Members = [] } = {} }) => {
          const remoteSNMPLogs = Members.map((data) => {
            const {
              Id,
              Severity,
              Substr,
              EntryType,
              Server,
              ServerPort,
            } = data;
            return {
              id: Id,
              location: data['@odata.id'],
              severity: Severity,
              type: EntryType,
              substr: Substr,
              server: Server,
              serverPort: ServerPort,
            };
          });
          commit('setRemoteSNMPLogs', remoteSNMPLogs);
        })
        .catch((error) => {
          console.log('Remote SNMP Logs Data:', error);
        });
    },
    async addNewRemoteSNMPLog(
      { dispatch },
      { severity, substr, server, serverPort }
    ) {
      const data = {};
      data.Severity = severity;
      data.Substr = substr;
      data.Server = server;
      data.ServerPort = serverPort;

      return await api
        .patch(
          '/redfish/v1/Systems/system/LogServices/EventLog/Remote/SNMP/Entries/0',
          data
        )
        .then(() => dispatch('getRemoteSNMPLogs'))
        .then(() =>
          i18n.t('pageRemoteLogs.toast.successAddRemoteSNMPLog', {
            server: server,
            serverPort: serverPort,
          })
        )
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageRemoteLogs.toast.errorAddRemoteSNMPLog'));
        });
    },
    async updateRemoteSNMPLog(
      { dispatch },
      { severity, substr, server, serverPort, location }
    ) {
      const data = {};
      data.Severity = severity;
      data.Substr = substr;
      data.Server = server;
      data.ServerPort = serverPort;
      return await api
        .patch(location, data)
        .then(() => dispatch('getRemoteSNMPLogs'))
        .then(() =>
          i18n.t('pageRemoteLogs.toast.successUpdateRemoteSNMPLog', {
            server: server,
            serverPort: serverPort,
          })
        )
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageRemoteLogs.toast.errorUpdateRemoteSNMPLog')
          );
        });
    },
    async deleteRemoteSNMPLog({ dispatch }, { server, serverPort, location }) {
      return await api
        .delete(location)
        .then(() => dispatch('getRemoteSNMPLogs'))
        .then(() =>
          i18n.t('pageRemoteLogs.toast.successDeleteRemoteSNMPLog', {
            server: server,
            serverPort: serverPort,
          })
        )
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageRemoteLogs.toast.errorDeleteRemoteSNMPLog')
          );
        });
    },
  },
};

export default RemoteSNMPLogsStore;
