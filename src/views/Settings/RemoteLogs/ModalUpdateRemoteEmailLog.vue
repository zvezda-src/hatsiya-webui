<template>
  <b-modal
    id="update-remote-email-log"
    ref="modal"
    @ok="onOk"
    @hidden="resetForm"
    @shown="fillForm"
  >
    <template #modal-title>
      <template v-if="remoteEmailLog">
        {{ $t('pageRemoteLogs.editRemoteEmailLog') }}
      </template>
      <template v-else>
        {{ $t('pageRemoteLogs.addNewRemoteEmailLog') }}
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

      <b-form-group
        :label="$t('pageRemoteLogs.modal.connType')"
        label-for="connType"
      >
        <b-form-select
          id="connType"
          v-model="form.connType"
          :options="connTypeOptions"
          :state="getValidationState($v.form.connType)"
          @input="$v.form.connType.$touch()"
        >
        </b-form-select>
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.connType.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('pageRemoteLogs.modal.userName')"
        label-for="userName"
      >
        <b-form-input
          id="userName"
          v-model="form.userName"
          type="text"
          :state="getValidationState($v.form.userName)"
          @input="$v.form.userName.$touch()"
        />
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.userName.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('pageRemoteLogs.modal.userPass')"
        label-for="userPass"
      >
        <b-form-input
          id="userPass"
          v-model="form.userPass"
          type="text"
          :state="getValidationState($v.form.userPass)"
          @input="$v.form.userPass.$touch()"
        />
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.userPass.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('pageRemoteLogs.modal.srcEmail')"
        label-for="srcEmail"
      >
        <b-form-input
          id="srcEmail"
          v-model="form.srcEmail"
          type="text"
          :state="getValidationState($v.form.srcEmail)"
          @input="$v.form.srcEmail.$touch()"
        />
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.srcEmail.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('pageRemoteLogs.modal.destEmail')"
        label-for="destEmail"
      >
        <b-form-input
          id="destEmail"
          v-model="form.destEmail"
          type="text"
          :state="getValidationState($v.form.destEmail)"
          @input="$v.form.destEmail.$touch()"
        />
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.destEmail.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>
    </b-form>
    <template #modal-ok>
      <template v-if="remoteEmailLog">
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
    remoteEmailLog: {
      type: Object,
      default: null,
      validator: (prop) => {
        if (prop === null) return true;
        return (
          Object.prototype.hasOwnProperty.call(prop, 'severity') &&
          Object.prototype.hasOwnProperty.call(prop, 'substr') &&
          Object.prototype.hasOwnProperty.call(prop, 'server') &&
          Object.prototype.hasOwnProperty.call(prop, 'serverPort') &&
          Object.prototype.hasOwnProperty.call(prop, 'connType') &&
          Object.prototype.hasOwnProperty.call(prop, 'userName') &&
          Object.prototype.hasOwnProperty.call(prop, 'userPass') &&
          Object.prototype.hasOwnProperty.call(prop, 'srcEmail') &&
          Object.prototype.hasOwnProperty.call(prop, 'destEmail')
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
        connType: null,
        userName: null,
        userPass: null,
        srcEmail: null,
        destEmail: null,
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
    connTypeOptions() {
      return [{ text: 'SMTP', value: 'SMTP' }];
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
        connType: {
          required,
        },
        userName: {
          required,
        },
        userPass: {
          required,
        },
        srcEmail: {
          required,
        },
        destEmail: {
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
        connType: this.form.connType,
        userName: this.form.userName,
        userPass: this.form.userPass,
        srcEmail: this.form.srcEmail,
        destEmail: this.form.destEmail,
        location: this.remoteEmailLog ? this.remoteEmailLog.location : null,
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
      if (this.remoteEmailLog) {
        this.form.severity = this.remoteEmailLog.severity;
        this.form.substr = this.remoteEmailLog.substr;
        this.form.server = this.remoteEmailLog.server;
        this.form.serverPort = this.remoteEmailLog.serverPort.toString();
        this.form.connType = this.remoteEmailLog.connType;
        this.form.userName = this.remoteEmailLog.userName;
        this.form.userPass = this.remoteEmailLog.userPass;
        this.form.srcEmail = this.remoteEmailLog.srcEmail;
        this.form.destEmail = this.remoteEmailLog.destEmail;
      } else {
        this.form.severity = this.severityOptions[0].value;
        this.form.substr = '*';
        this.form.server = '';
        this.form.serverPort = '587';
        this.form.connType = this.connTypeOptions[0].value;
        this.form.userName = '';
        this.form.userPass = '';
        this.form.srcEmail = '';
        this.form.destEmail = '';
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
