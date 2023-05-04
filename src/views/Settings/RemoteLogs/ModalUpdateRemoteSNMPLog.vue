<template>
  <b-modal
    id="update-remote-snmp-log"
    ref="modal"
    @ok="onOk"
    @hidden="resetForm"
    @shown="fillForm"
  >
    <template #modal-title>
      <template v-if="remoteSnmpLog">
        {{ $t('pageRemoteLogs.editRemoteSNMPLog') }}
      </template>
      <template v-else>
        {{ $t('pageRemoteLogs.addNewRemoteSNMPLog') }}
      </template>
    </template>
    <b-form>
      <b-form-group
        :label="$t('pageRemoteLogs.modal.severity')"
        label-for="severity"
      >
        <b-form-select
          id="severity"
          v-model="form.severity"
          :options="severityOptions"
          :state="getValidationState($v.form.severity)"
          @input="$v.form.severity.$touch()"
        >
        </b-form-select>
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.severity.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('pageRemoteLogs.modal.substr')"
        label-for="substr"
      >
        <b-form-input
          id="substr"
          v-model="form.substr"
          type="text"
          :state="getValidationState($v.form.substr)"
          @input="$v.form.substr.$touch()"
        />
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.substr.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('pageRemoteLogs.modal.server')"
        label-for="server"
      >
        <b-form-input
          id="server"
          v-model="form.server"
          type="text"
          :state="getValidationState($v.form.server)"
          @input="$v.form.server.$touch()"
        />
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.server.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('pageRemoteLogs.modal.serverPort')"
        label-for="serverPort"
      >
        <b-form-input
          id="serverPort"
          v-model="form.serverPort"
          type="number"
          :state="getValidationState($v.form.serverPort)"
          @input="$v.form.serverPort.$touch()"
        />
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.serverPort.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>
    </b-form>
    <template #modal-ok>
      <template v-if="remoteSnmpLog">
        {{ $t('global.action.refresh') }}
      </template>
      <template v-else>
        {{ $t('global.action.add') }}
      </template>
    </template>
    <template #modal-cancel>
      {{ $t('global.action.cancel') }}
    </template>
  </b-modal>
</template>

<script>
//import { required, ipAddress, requiredIf } from 'vuelidate/lib/validators';
import { required } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';

export default {
  mixins: [VuelidateMixin],
  props: {
    remoteSnmpLog: {
      type: Object,
      default: null,
      validator: (prop) => {
        if (prop === null) return true;
        return (
          Object.prototype.hasOwnProperty.call(prop, 'severity') &&
          Object.prototype.hasOwnProperty.call(prop, 'substr') &&
          Object.prototype.hasOwnProperty.call(prop, 'server') &&
          Object.prototype.hasOwnProperty.call(prop, 'serverPort')
        );
      },
    },
  },
  data() {
    return {
      form: {
        severity: null,
        substr: null,
        server: null,
        serverPort: null,
      },
    };
  },
  computed: {
    severityOptions() {
      return [
        { text: 'Info', value: 'Info' },
        { text: 'Warning', value: 'Warning' },
        { text: 'Critical', value: 'Critical' },
      ];
    },
  },
  validations() {
    return {
      form: {
        severity: {
          required,
        },
        substr: {
          required,
        },
        server: {
          required,
        },
        serverPort: {
          required,
        },
      },
    };
  },
  methods: {
    handleSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      const serverPort = Number(this.form.serverPort);
      if (
        this.form.serverPort.length > 5 ||
        serverPort < 1 ||
        serverPort >= 65536
      )
        return;
      this.$emit('ok', {
        severity: this.form.severity,
        substr: this.form.substr,
        server: this.form.server,
        serverPort: serverPort,
        location: this.remoteSnmpLog ? this.remoteSnmpLog.location : null,
      });
      this.closeModal();
    },
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
      });
    },
    resetForm() {
      this.$v.$reset();
    },
    fillForm() {
      if (this.remoteSnmpLog) {
        this.form.severity = this.remoteSnmpLog.severity;
        this.form.substr = this.remoteSnmpLog.substr;
        this.form.server = this.remoteSnmpLog.server;
        this.form.serverPort = this.remoteSnmpLog.serverPort.toString();
      } else {
        this.form.severity = this.severityOptions[0].value;
        this.form.substr = '*';
        this.form.server = '';
        this.form.serverPort = '162';
      }
    },
    onOk(bvModalEvt) {
      // prevent modal close
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
  },
};
</script>
