<template>
  <div :class="marginClass">
    <div ref="toolbar" class="kvm-toolbar">
      <b-row class="d-flex">
        <b-col class="d-flex flex-column justify-content-end" cols="4">
          <dl class="mb-2" sm="2" md="2">
            <dt class="d-inline font-weight-bold mr-1">
              {{ $t('pageKvm.status') }}:
            </dt>
            <dd class="d-inline">
              <status-icon :status="serverStatusIcon" />
              <span class="d-none d-md-inline"> {{ serverStatus }}</span>
            </dd>
          </dl>
        </b-col>

        <b-col class="d-flex justify-content-end pr-1">
          <b-button
            v-if="isConnected"
            variant="link"
            type="button"
            @click="startStopVideoRecord()"
          >
            <icon-stop v-if="isVideoRecordStarted" />
            <icon-recording v-if="!isVideoRecordStarted" />
            {{
              !isVideoRecordStarted
                ? $t('pageKvm.buttonVideoRecordStart')
                : $t('pageKvm.buttonVideoRecordStop')
            }}
          </b-button>
          <b-button
            v-if="isConnected"
            variant="link"
            type="button"
            @click="sendCtrlAltDel"
          >
            <icon-arrow-down />
            {{ $t('pageKvm.buttonCtrlAltDelete') }}
          </b-button>
          <b-button
            v-if="!isFullWindow"
            variant="link"
            type="button"
            @click="openConsoleWindow()"
          >
            <icon-launch />
            {{ $t('pageKvm.openNewTab') }}
          </b-button>
        </b-col>
      </b-row>
      <modal-start-video-recording
        :video-recording="modalStartVideoRecording"
        @ok="onModalOk"
      />
    </div>
    <div id="terminal-kvm" ref="panel" :class="terminalClass"></div>
  </div>
</template>

<script>
import Axios from 'axios';
import IconRecording from '@carbon/icons-vue/es/recording/20';
import IconStop from '@carbon/icons-vue/es/stop/20';
import ModalStartVideoRecording from './ModalStartVideoRecording';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import RFB from '@novnc/novnc/core/rfb';
import StatusIcon from '@/components/Global/StatusIcon';
import IconLaunch from '@carbon/icons-vue/es/launch/20';
import IconArrowDown from '@carbon/icons-vue/es/arrow--down/16';
import { throttle } from 'lodash';
import { mapState } from 'vuex';

const Connecting = 0;
const Connected = 1;
const Disconnected = 2;

export default {
  name: 'KvmConsole',
  components: {
    StatusIcon,
    IconLaunch,
    IconArrowDown,
    IconRecording,
    IconStop,
    ModalStartVideoRecording,
  },
  mixins: [BVToastMixin],
  props: {
    isFullWindow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isConsoleWindow: null,
      rfb: null,
      isConnected: false,
      terminalClass: this.isFullWindow ? 'full-window' : '',
      marginClass: this.isFullWindow ? 'margin-left-full-window' : '',
      status: Connecting,
      convasRef: null,
      resizeKvmWindow: null,
      timer: '',
      url: `https://${window.location.host}/kvm/download/video/`,
      downloadVideoInProgress: false,
      isVideoRecordStarted: false,
      modalStartVideoRecording: null,
      autoDownload: true,
    };
  },
  computed: {
    ...mapState('authentication', ['consoleWindow']),
    serverStatusIcon() {
      if (this.status === Connected) {
        return 'success';
      } else if (this.status === Disconnected) {
        return 'danger';
      }
      return 'secondary';
    },
    serverStatus() {
      if (this.status === Connected) {
        return this.$t('pageKvm.connected');
      } else if (this.status === Disconnected) {
        return this.$t('pageKvm.disconnected');
      }
      return this.$t('pageKvm.connecting');
    },
      videoFiles() {
      return this.$store.getters['kvmConsole/allVideoFiles'];
    },
  },
  watch: {
    consoleWindow() {
      if (this.consoleWindow == false) this.isConsoleWindow.close();
    },
  },
  created() {
    this.$store.dispatch('global/getSystemInfo');
  },
  mounted() {
    this.openTerminal();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeKvmWindow);
    this.closeTerminal();
    this.cancelAutoUpdate();
  },
  methods: {
    sendCtrlAltDel() {
      this.rfb.sendCtrlAltDel();
    },
    closeTerminal() {
      this.rfb.disconnect();
      this.rfb = null;
    },
    openTerminal() {
      const token = this.$store.getters['authentication/token'];
      this.rfb = new RFB(
        this.$refs.panel,
        `wss://${window.location.host}/kvm/0`,
        { wsProtocols: [token] }
      );

      this.rfb.scaleViewport = true;
      this.rfb.clipViewport = true;
      const that = this;

      this.resizeKvmWindow = throttle(() => {
        setTimeout(that.setWidthToolbar, 0);
      }, 1000);
      window.addEventListener('resize', this.resizeKvmWindow);

      this.rfb.addEventListener('connect', () => {
        that.isConnected = true;
        that.status = Connected;
        that.setWidthToolbar();
      });

      this.rfb.addEventListener('disconnect', () => {
        this.isConnected = false;
        that.status = Disconnected;
      });
    },
    setWidthToolbar() {
      if (
        this.$refs.panel.children &&
        this.$refs.panel.children.length > 0 &&
        this.$refs.panel.children[0].children.length > 0
      ) {
        this.$refs.toolbar.style.width =
          this.$refs.panel.children[0].children[0].clientWidth - 10 + 'px';
      }
    },
    openConsoleWindow() {
      // If isConsoleWindow is not null
      // Check the newly opened window is closed or not
      if (this.isConsoleWindow) {
        // If window is not closed set focus to new window
        // If window is closed, do open new window
        if (!this.isConsoleWindow.closed) {
          this.isConsoleWindow.focus();
          return;
        } else {
          this.openNewWindow();
        }
      } else {
        // If isConsoleWindow is null, open new window
        this.openNewWindow();
      }
    },
    openNewWindow() {
      this.isConsoleWindow = window.open(
        '#/console/kvm',
        'kvmConsoleWindow',
        'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=700,height=550'
      );
    },
    forceFileDownload(response, video_file) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', video_file); //or any other extension
      document.body.appendChild(link);
      link.click();
    },
    downloadWithVueResource(video_file) {
      this.$http({
        method: 'get',
        url: this.url + video_file,
        responseType: 'arraybuffer',
      })
        .then((response) => {
          this.forceFileDownload(response, video_file);
        })
        .catch(() => console.log('error occured'))
        .finally(() => {
          //console.log('req done !!!');
          this.$store.dispatch('kvmConsole/deleteVideoFile', {
            video_file,
          });
        });
    },
    downloadWithAxios(video_file) {
      Axios({
        method: 'get',
        url: this.url + video_file,
        responseType: 'arraybuffer',
      })
        .then((response) => {
          this.forceFileDownload(response, video_file);
        })
        .catch(() => console.log('error occured'))
        .finally(() => {
          //console.log('req done !!!');
          this.$store.dispatch('kvmConsole/deleteVideoFile', {
            video_file,
          });
        });
    },
    fetchVideoList1() {
      //console.log('fetchVideoList ' + this.downloadVideoInProgress);
      if (!this.downloadVideoInProgress) {
        //console.log('start downloadWithVueResource');
        this.downloadVideoInProgress = true;
        //this.downloadWithVueResource('bmcweb');
        this.downloadWithAxios('bmcweb');
        this.downloadVideoInProgress = false;
        //console.log('stop downloadWithVueResource');
      }
    },
    fetchVideoList() {
      //console.log('fetchVideoList ' + this.downloadVideoInProgress);
      if (!this.downloadVideoInProgress) {
        this.downloadVideoInProgress = true;

        this.$store.dispatch('kvmConsole/getVideoFiles').finally(() => {
          const t = this.videoFiles;
          //console.info(t);
          //console.log('t.length=', t.length);
          if (t.length > 0) {
            const video_file = t[0]['file'];
            //console.log(video_file);
            //console.log('start download');

            //this.downloadWithVueResource(video_file);
            this.downloadWithAxios(video_file);

            //console.log('stop download');
          }
        });

        this.downloadVideoInProgress = false;
      }
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
      if (this.isVideoRecordStarted) {
        this.$store.dispatch('kvmConsole/stopVideoRecording').finally(() => {
          //console.log('stopVideoRecording done');
          this.$store.dispatch('kvmConsole/clearVideoFileList').finally(() => {
            //console.log('clearVideoFileList done');
          });
        });
      }
    },
    initModaStartVideoRecording(startVideoRecording = null) {
      this.modalStartVideoRecording = startVideoRecording;
      this.$bvModal.show('start-video-recording');
    },
    startStopVideoRecord() {
      //console.log('isVideoRecordStarted=', this.isVideoRecordStarted);
      if (!this.isVideoRecordStarted) {
        //console.log('start modal');
        this.initModaStartVideoRecording(null);
      } else {
        this.$store.dispatch('kvmConsole/stopVideoRecording');
        this.isVideoRecordStarted = false;
        this.fetchVideoList();
      }
    },
    onModalOk({ colorQuality, timeOfPart, FPS, autoDownload }) {
      //console.log('colorQuality=', colorQuality);
      //console.log('timeOfPart=', timeOfPart);
      //console.log('FPS=', FPS);
      //console.log('autoDownload=', autoDownload);

      this.autoDownload = autoDownload;

      this.$store
        .dispatch('kvmConsole/startVideoRecording', {
          colorQuality,
          FPS,
          timeOfPart,
        })
        .then(() => {
          //console.log('start success');
          this.isVideoRecordStarted = true;
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          //console.log('start done');
        });
    },
  },
};
</script>

<style scoped lang="scss">
.button-ctrl-alt-delete {
  float: right;
}

.kvm-status {
  padding-top: $spacer / 2;
  padding-left: $spacer / 4;
  display: inline-block;
}

.margin-left-full-window {
  margin-left: 5px;
}
</style>
