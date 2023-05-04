<template>
  <b-container fluid="xl">
    <page-title />
    <b-row>
      <b-col xl="11" class="text-right">
        <b-button variant="primary" @click="initModalUpdateRemoteLog(null)">
          <icon-add />
          {{ $t('pageRemoteLogs.addNewRemoteLog') }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="11">
        <b-table
          responsive="md"
          show-empty
          hover
          :fields="fields"
          :items="tableItems"
          :empty-text="$t('global.table.emptyMessage')"
        >
          <template #cell(validFrom)="{ value }">
            {{ value | formatDate }}
          </template>

          <template #cell(actions)="{ value, item }">
            <table-row-action
              v-for="(action, index) in value"
              :key="index"
              :value="action.value"
              :title="action.title"
              :enabled="action.enabled"
              @click-table-action="onTableRowAction($event, item)"
            >
              <template #icon>
                <icon-edit v-if="action.value === 'edit'" />
                <icon-trashcan v-if="action.value === 'delete'" />
              </template>
            </table-row-action>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <!-- Remote Email Log -->
    <b-row>
      <b-col xl="11" class="text-right">
        <b-button
          variant="primary"
          @click="initModalUpdateRemoteEmailLog(null)"
        >
          <icon-add />
          {{ $t('pageRemoteLogs.addNewRemoteEmailLog') }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="11">
        <b-table
          responsive="md"
          show-empty
          hover
          :fields="emailFields"
          :items="tableEmailItems"
          :empty-text="$t('global.table.emptyMessage')"
        >
          <template #cell(validFrom)="{ value }">
            {{ value | formatDate }}
          </template>

          <template #cell(actions)="{ value, item }">
            <table-row-action
              v-for="(action, index) in value"
              :key="index"
              :value="action.value"
              :title="action.title"
              :enabled="action.enabled"
              @click-table-action="onEmailTableRowAction($event, item)"
            >
              <template #icon>
                <icon-edit v-if="action.value === 'edit'" />
                <icon-trashcan v-if="action.value === 'delete'" />
              </template>
            </table-row-action>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <!-- Remote SNMP Log -->
    <b-row>
      <b-col xl="11" class="text-right">
        <b-button variant="primary" @click="initModalUpdateRemoteSNMPLog(null)">
          <icon-add />
          {{ $t('pageRemoteLogs.addNewRemoteSNMPLog') }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="11">
        <b-table
          responsive="md"
          show-empty
          hover
          :fields="snmpFields"
          :items="tableSNMPItems"
          :empty-text="$t('global.table.emptyMessage')"
        >
          <template #cell(validFrom)="{ value }">
            {{ value | formatDate }}
          </template>

          <template #cell(actions)="{ value, item }">
            <table-row-action
              v-for="(action, index) in value"
              :key="index"
              :value="action.value"
              :title="action.title"
              :enabled="action.enabled"
              @click-table-action="onSNMPTableRowAction($event, item)"
            >
              <template #icon>
                <icon-edit v-if="action.value === 'edit'" />
                <icon-trashcan v-if="action.value === 'delete'" />
              </template>
            </table-row-action>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <modal-update-remote-log :remote-log="modalRemoteLog" @ok="onModalOk" />
    <modal-update-remote-email-log
      :remote-email-log="modalRemoteEmailLog"
      @ok="onEmailModalOk"
    />
    <modal-update-remote-snmp-log
      :remote-snmp-log="modalRemoteSNMPLog"
      @ok="onSNMPModalOk"
    />
  </b-container>
</template>

<script>
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
import IconEdit from '@carbon/icons-vue/es/edit/20';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';

import ModalUpdateRemoteLog from './ModalUpdateRemoteLog';
import ModalUpdateRemoteEmailLog from './ModalUpdateRemoteEmailLog';
import ModalUpdateRemoteSnmpLog from './ModalUpdateRemoteSNMPLog';
import PageTitle from '@/components/Global/PageTitle';
import TableRowAction from '@/components/Global/TableRowAction';
//import StatusIcon from '@/components/Global/StatusIcon';
//import Alert from '@/components/Global/Alert';

import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';

export default {
  name: 'RemoteLogs',
  components: {
    //Alert,
    IconAdd,
    IconEdit,
    IconTrashcan,
    ModalUpdateRemoteLog,
    ModalUpdateRemoteEmailLog,
    ModalUpdateRemoteSnmpLog,
    PageTitle,
    //StatusIcon,
    TableRowAction,
  },
  mixins: [BVToastMixin, LoadingBarMixin],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  data() {
    return {
      modalRemoteLog: null,
      fields: [
        //{
        //  key: 'id',
        //  label: this.$t('pageRemoteLogs.table.id'),
        //},
        {
          key: 'severity',
          label: this.$t('pageRemoteLogs.table.severity'),
        },
        {
          key: 'substr',
          label: this.$t('pageRemoteLogs.table.substr'),
        },
        {
          key: 'server',
          label: this.$t('pageRemoteLogs.table.server'),
        },
        {
          key: 'serverPort',
          label: this.$t('pageRemoteLogs.table.serverPort'),
        },
        {
          key: 'connType',
          label: this.$t('pageRemoteLogs.table.connType'),
        },
        {
          key: 'actions',
          label: '',
          tdClass: 'text-right text-nowrap',
        },
      ],
      modalRemoteEmailLog: null,
      emailFields: [
        //{
        //  key: 'id',
        //  label: this.$t('pageRemoteLogs.table.id'),
        //},
        {
          key: 'severity',
          label: this.$t('pageRemoteLogs.table.severity'),
        },
        {
          key: 'substr',
          label: this.$t('pageRemoteLogs.table.substr'),
        },
        {
          key: 'server',
          label: this.$t('pageRemoteLogs.table.server'),
        },
        {
          key: 'serverPort',
          label: this.$t('pageRemoteLogs.table.serverPort'),
        },
        {
          key: 'connType',
          label: this.$t('pageRemoteLogs.table.connType'),
        },
        {
          key: 'userName',
          label: this.$t('pageRemoteLogs.table.userName'),
        },
        {
          key: 'userPass',
          label: this.$t('pageRemoteLogs.table.userPass'),
        },
        {
          key: 'srcEmail',
          label: this.$t('pageRemoteLogs.table.srcEmail'),
        },
        {
          key: 'destEmail',
          label: this.$t('pageRemoteLogs.table.destEmail'),
        },
        {
          key: 'actions',
          label: '',
          tdClass: 'text-right text-nowrap',
        },
      ],
      modalRemoteSNMPLog: null,
      snmpFields: [
        //{
        //  key: 'id',
        //  label: this.$t('pageRemoteLogs.table.id'),
        //},
        {
          key: 'severity',
          label: this.$t('pageRemoteLogs.table.severity'),
        },
        {
          key: 'substr',
          label: this.$t('pageRemoteLogs.table.substr'),
        },
        {
          key: 'server',
          label: this.$t('pageRemoteLogs.table.server'),
        },
        {
          key: 'serverPort',
          label: this.$t('pageRemoteLogs.table.serverPort'),
        },
        {
          key: 'actions',
          label: '',
          tdClass: 'text-right text-nowrap',
        },
      ],
    };
  },
  computed: {
    remoteLogs() {
      return this.$store.getters['remoteLogs/allRemoteLogs'];
    },
    tableItems() {
      return this.remoteLogs.map((remoteLog) => {
        return {
          ...remoteLog,
          actions: [
            {
              value: 'edit',
              title: this.$t('pageRemoteLogs.editRemoteLog'),
            },
            {
              value: 'delete',
              title: this.$t('pageRemoteLogs.deleteRemoteLog'),
            },
          ],
        };
      });
    },
    remoteEmailLogs() {
      return this.$store.getters['remoteEmailLogs/allRemoteEmailLogs'];
    },
    tableEmailItems() {
      return this.remoteEmailLogs.map((remoteEmailLog) => {
        return {
          ...remoteEmailLog,
          actions: [
            {
              value: 'edit',
              title: this.$t('pageRemoteLogs.editRemoteEmailLog'),
            },
            {
              value: 'delete',
              title: this.$t('pageRemoteLogs.deleteRemoteEmailLog'),
            },
          ],
        };
      });
    },
    remoteSNMPLogs() {
      return this.$store.getters['remoteSNMPLogs/allRemoteSNMPLogs'];
    },
    tableSNMPItems() {
      return this.remoteSNMPLogs.map((remoteSNMPLog) => {
        return {
          ...remoteSNMPLog,
          actions: [
            {
              value: 'edit',
              title: this.$t('pageRemoteLogs.editRemoteSNMPLog'),
            },
            {
              value: 'delete',
              title: this.$t('pageRemoteLogs.deleteRemoteSNMPLog'),
            },
          ],
        };
      });
    },
  },
  async created() {
    this.startLoader();
    this.$store
      .dispatch('remoteLogs/getRemoteLogs')
      .finally(() => this.endLoader());
    this.startLoader();
    this.$store
      .dispatch('remoteEmailLogs/getRemoteEmailLogs')
      .finally(() => this.endLoader());
    this.$store
      .dispatch('remoteSNMPLogs/getRemoteSNMPLogs')
      .finally(() => this.endLoader());
  },
  methods: {
    onTableRowAction(event, rowItem) {
      switch (event) {
        case 'edit':
          this.initModalUpdateRemoteLog(rowItem);
          break;
        case 'delete':
          this.initModalDeleteRemoteLog(rowItem);
          break;
        default:
          break;
      }
    },
    initModalUpdateRemoteLog(remoteLog = null) {
      this.modalRemoteLog = remoteLog;
      this.$bvModal.show('update-remote-log');
    },
    initModalDeleteRemoteLog(remoteLog) {
      this.$bvModal
        .msgBoxConfirm(
          this.$t('pageRemoteLogs.modal.deleteConfirmMessage', {
            server: remoteLog.server,
            serverPort: remoteLog.serverPort,
          }),
          {
            title: this.$t('pageRemoteLogs.deleteRemoteLog'),
            okTitle: this.$t('global.action.delete'),
            cancelTitle: this.$t('global.action.cancel'),
          }
        )
        .then((deleteConfirmed) => {
          if (deleteConfirmed) this.deleteRemoteLog(remoteLog);
        });
    },
    deleteRemoteLog({ server, serverPort, location }) {
      this.startLoader();
      this.$store
        .dispatch('remoteLogs/deleteRemoteLog', {
          server,
          serverPort,
          location,
        })
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    onModalOk({ severity, substr, server, serverPort, connType, location }) {
      if (location) {
        // Replace an existing remote log
        this.updateRemoteLog(
          severity,
          substr,
          server,
          serverPort,
          connType,
          location
        );
      } else {
        // Upload a new remote log
        this.addNewRemoteLog(severity, substr, server, serverPort, connType);
      }
    },
    addNewRemoteLog(severity, substr, server, serverPort, connType) {
      this.startLoader();
      this.$store
        .dispatch('remoteLogs/addNewRemoteLog', {
          severity,
          substr,
          server,
          serverPort,
          connType,
        })
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    updateRemoteLog(severity, substr, server, serverPort, connType, location) {
      this.startLoader();
      this.$store
        .dispatch('remoteLogs/updateRemoteLog', {
          severity,
          substr,
          server,
          serverPort,
          connType,
          location,
        })
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    // Remote Email Log
    onEmailTableRowAction(event, rowItem) {
      switch (event) {
        case 'edit':
          this.initModalUpdateRemoteEmailLog(rowItem);
          break;
        case 'delete':
          this.initModalDeleteRemoteEmailLog(rowItem);
          break;
        default:
          break;
      }
    },
    initModalUpdateRemoteEmailLog(remoteEmailLog = null) {
      this.modalRemoteEmailLog = remoteEmailLog;
      this.$bvModal.show('update-remote-email-log');
    },
    initModalDeleteRemoteEmailLog(remoteEmailLog) {
      this.$bvModal
        .msgBoxConfirm(
          this.$t('pageRemoteLogs.modal.deleteEmailConfirmMessage', {
            server: remoteEmailLog.server,
            serverPort: remoteEmailLog.serverPort,
          }),
          {
            title: this.$t('pageRemoteLogs.deleteRemoteEmailLog'),
            okTitle: this.$t('global.action.delete'),
            cancelTitle: this.$t('global.action.cancel'),
          }
        )
        .then((deleteConfirmed) => {
          if (deleteConfirmed) this.deleteRemoteEmailLog(remoteEmailLog);
        });
    },
    deleteRemoteEmailLog({ server, serverPort, location }) {
      this.startLoader();
      this.$store
        .dispatch('remoteEmailLogs/deleteRemoteEmailLog', {
          server,
          serverPort,
          location,
        })
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    onEmailModalOk({
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
    }) {
      if (location) {
        // Replace an existing remote log
        this.updateRemoteEmailLog(
          severity,
          substr,
          server,
          serverPort,
          connType,
          userName,
          userPass,
          srcEmail,
          destEmail,
          location
        );
      } else {
        // Upload a new remote log
        this.addNewRemoteEmailLog(
          severity,
          substr,
          server,
          serverPort,
          connType,
          userName,
          userPass,
          srcEmail,
          destEmail
        );
      }
    },
    addNewRemoteEmailLog(
      severity,
      substr,
      server,
      serverPort,
      connType,
      userName,
      userPass,
      srcEmail,
      destEmail
    ) {
      this.startLoader();
      this.$store
        .dispatch('remoteEmailLogs/addNewRemoteEmailLog', {
          severity,
          substr,
          server,
          serverPort,
          connType,
          userName,
          userPass,
          srcEmail,
          destEmail,
        })
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    updateRemoteEmailLog(
      severity,
      substr,
      server,
      serverPort,
      connType,
      userName,
      userPass,
      srcEmail,
      destEmail,
      location
    ) {
      this.startLoader();
      this.$store
        .dispatch('remoteEmailLogs/updateRemoteEmailLog', {
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
        })
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    // Remote SNMP Log
    onSNMPTableRowAction(event, rowItem) {
      switch (event) {
        case 'edit':
          this.initModalUpdateRemoteSNMPLog(rowItem);
          break;
        case 'delete':
          this.initModalDeleteRemoteSNMPLog(rowItem);
          break;
        default:
          break;
      }
    },
    initModalUpdateRemoteSNMPLog(remoteSNMPLog = null) {
      this.modalRemoteSNMPLog = remoteSNMPLog;
      this.$bvModal.show('update-remote-snmp-log');
    },
    initModalDeleteRemoteSNMPLog(remoteSNMPLog) {
      this.$bvModal
        .msgBoxConfirm(
          this.$t('pageRemoteLogs.modal.deleteSNMPConfirmMessage', {
            server: remoteSNMPLog.server,
            serverPort: remoteSNMPLog.serverPort,
          }),
          {
            title: this.$t('pageRemoteLogs.deleteRemoteSNMPLog'),
            okTitle: this.$t('global.action.delete'),
            cancelTitle: this.$t('global.action.cancel'),
          }
        )
        .then((deleteConfirmed) => {
          if (deleteConfirmed) this.deleteRemoteSNMPLog(remoteSNMPLog);
        });
    },
    deleteRemoteSNMPLog({ server, serverPort, location }) {
      this.startLoader();
      this.$store
        .dispatch('remoteSNMPLogs/deleteRemoteSNMPLog', {
          server,
          serverPort,
          location,
        })
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    onSNMPModalOk({ severity, substr, server, serverPort, location }) {
      if (location) {
        // Replace an existing remote log
        this.updateRemoteSNMPLog(
          severity,
          substr,
          server,
          serverPort,
          location
        );
      } else {
        // Upload a new remote log
        this.addNewRemoteSNMPLog(severity, substr, server, serverPort);
      }
    },
    addNewRemoteSNMPLog(severity, substr, server, serverPort) {
      this.startLoader();
      this.$store
        .dispatch('remoteSNMPLogs/addNewRemoteSNMPLog', {
          severity,
          substr,
          server,
          serverPort,
        })
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    updateRemoteSNMPLog(severity, substr, server, serverPort, location) {
      this.startLoader();
      this.$store
        .dispatch('remoteSNMPLogs/updateRemoteSNMPLog', {
          severity,
          substr,
          server,
          serverPort,
          location,
        })
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
  },
};
</script>
