import api from '@/store/api';
import i18n from '@/i18n';

const RemoteEmailLogsStore = {
  namespaced: true,
  state: {
    allRemoteEmailLogs: [],
  },
  getters: {
    allRemoteEmailLogs: (state) => state.allRemoteEmailLogs,
  },
  mutations: {
    setRemoteEmailLogs(state, remoteEmailLogs) {
      state.allRemoteEmailLogs = remoteEmailLogs;
    },
  },
  actions: {
    async getRemoteEmailLogs({ commit }) {
      return await api
        .get(
          '/redfish/v1/Systems/system/LogServices/EventLog/Remote/Email/Entries'
        )
        .then(({ data: { Members = [] } = {} }) => {
          const remoteEmailLogs = Members.map((data) => {
            const {
              Id,
              Severity,
              Substr,
              EntryType,
              Server,
              ServerPort,
              ConnType,
              UserName,
              UserPass,
              SrcEmail,
              DestEmail,
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
              userName: UserName,
              userPass: UserPass,
              srcEmail: SrcEmail,
              destEmail: DestEmail,
            };
          });
          commit('setRemoteEmailLogs', remoteEmailLogs);
        })
        .catch((error) => {
          console.log('Remote Email Logs Data:', error);
        });
    },
    async addNewRemoteEmailLog(
      { dispatch },
      {
        severity,
        substr,
        server,
        serverPort,
        connType,
        userName,
        userPass,
        srcEmail,
        destEmail,
      }
    ) {
      const data = {};
      data.Severity = severity;
      data.Substr = substr;
      data.Server = server;
      data.ServerPort = serverPort;
      data.ConnType = connType;
      data.UserName = userName;
      data.UserPass = userPass;
      data.SrcEmail = srcEmail;
      data.DestEmail = destEmail;

      return await api
        .patch(
          '/redfish/v1/Systems/system/LogServices/EventLog/Remote/Email/Entries/0',
          data
        )
        .then(() => dispatch('getRemoteEmailLogs'))
        .then(() =>
          i18n.t('pageRemoteLogs.toast.successAddRemoteEmailLog', {
            server: server,
            serverPort: serverPort,
          })
        )
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageRemoteLogs.toast.errorAddRemoteEmailLog')
          );
        });
    },
    async updateRemoteEmailLog(
      { dispatch },
      {
        severity,
        substr,
        server,
        serverPort,
        connType,
        userName,
        userPass,
        srcEmail,
        destEmail,
        location,
      }
    ) {
      const data = {};
      data.Severity = severity;
      data.Substr = substr;
      data.Server = server;
      data.ServerPort = serverPort;
      data.ConnType = connType;
      data.UserName = userName;
      data.UserPass = userPass;
      data.SrcEmail = srcEmail;
      data.DestEmail = destEmail;

      return await api
        .patch(location, data)
        .then(() => dispatch('getRemoteEmailLogs'))
        .then(() =>
          i18n.t('pageRemoteLogs.toast.successUpdateRemoteEmailLog', {
            server: server,
            serverPort: serverPort,
          })
        )
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageRemoteLogs.toast.errorUpdateRemoteEmailLog')
          );
        });
    },
    async deleteRemoteEmailLog({ dispatch }, { server, serverPort, location }) {
      return await api
        .delete(location)
        .then(() => dispatch('getRemoteEmailLogs'))
        .then(() =>
          i18n.t('pageRemoteLogs.toast.successDeleteRemoteEmailLog', {
            server: server,
            serverPort: serverPort,
          })
        )
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageRemoteLogs.toast.errorDeleteRemoteEmailLog')
          );
        });
    },
  },
};

export default RemoteEmailLogsStore;
