import api from '@/store/api';
import i18n from '@/i18n';

const KvmConsoleStore = {
  namespaced: true,
  state: {
    allVideoFiles: [],
  },
  getters: {
    allVideoFiles: (state) => state.allVideoFiles,
  },
  mutations: {
    setVideoFiles(state, videoFiles) {
      state.allVideoFiles = videoFiles;
    },
  },
  actions: {
    async getVideoFiles({ commit }) {
      return await api
        .get('/kvm/video/list')
        .then(({ data: { Members = [] } = {} }) => {
          const videoFiles = Members.map((data) => {
            const { File } = data;
            return {
              file: File,
            };
          });
          commit('setVideoFiles', videoFiles);
        })
        .catch((error) => {
          console.log('Video Files Data:', error);
        });
    },
    async deleteVideoFile({ dispatch }, { video_file }) {
      const loc = '/kvm/remove/video/' + video_file;
      //console.log('loc=', loc);
      return await api.delete(loc).then(() => dispatch('getVideoFiles'));
    },
    async clearVideoFileList({ dispatch }) {
      const loc = '/kvm/video/list/clear';
      //console.log('loc=', loc);
      return await api.post(loc).then(() => dispatch('getVideoFiles'));
    },
    async startVideoRecording({ dispatch }, { colorQuality, timeOfPart, FPS }) {
      const loc = '/kvm/video/start';
      //console.log('loc=', loc);
      return await api
        .patch(loc, {
          HighQuality: colorQuality == 'High',
          TimeOfPart: timeOfPart,
          FPS: FPS,
        })
        .then(() => dispatch('getVideoFiles'))
        .catch((error) => {
          console.log('error', error);
          throw new Error(i18n.t('pageKvm.toast.invalidVideoParams'));
        });
    },
    async stopVideoRecording({ dispatch }) {
      const loc = '/kvm/video/stop';
      //console.log('loc=', loc);
      return await api.post(loc).then(() => dispatch('getVideoFiles'));
    },
  },
};

export default KvmConsoleStore;
