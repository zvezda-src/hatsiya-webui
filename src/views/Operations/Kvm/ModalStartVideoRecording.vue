<template>
  <b-modal
    id="start-video-recording"
    ref="modal"
    @ok="onOk"
    @hidden="resetForm"
    @shown="fillForm"
  >
    <template #modal-title>
      {{ $t('pageKvm.modal.startVideoRecordingTitle') }}
    </template>
    <b-form>
      <b-form-group
        :label="$t('pageKvm.modal.colorQuality')"
        label-for="colorQuality"
      >
        <b-form-select
          id="colorQuality"
          v-model="form.colorQuality"
          :options="colorQualityOptions"
          :state="getValidationState($v.form.colorQuality)"
          @input="$v.form.colorQuality.$touch()"
        >
        </b-form-select>
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.colorQuality.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('pageKvm.modal.autoDownload')"
        label-for="autoDownload"
      >
        <b-form-select
          id="autoDownload"
          v-model="form.autoDownload"
          :options="autoDownloadOptions"
          :state="getValidationState($v.form.autoDownload)"
          @input="$v.form.autoDownload.$touch()"
        >
        </b-form-select>
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.autoDownload.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group :label="$t('pageKvm.modal.FPS')" label-for="FPS">
        <b-form-input
          id="FPS"
          v-model="form.FPS"
          type="number"
          :state="getValidationState($v.form.FPS)"
          @input="$v.form.FPS.$touch()"
        />
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.FPS.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('pageKvm.modal.timeOfPart')"
        label-for="timeOfPart"
      >
        <b-form-input
          id="timeOfPart"
          v-model="form.timeOfPart"
          type="number"
          :state="getValidationState($v.form.timeOfPart)"
          @input="$v.form.timeOfPart.$touch()"
        />
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.timeOfPart.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>
    </b-form>
    <template #modal-ok>
      {{ $t('global.action.start') }}
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
    videoRecording: {
      type: Object,
      default: null,
      validator: (prop) => {
        if (prop === null) return true;
        return (
          Object.prototype.hasOwnProperty.call(prop, 'colorQuality') &&
          Object.prototype.hasOwnProperty.call(prop, 'timeOfPart') &&
          Object.prototype.hasOwnProperty.call(prop, 'FPS') &&
          Object.prototype.hasOwnProperty.call(prop, 'autoDownload')
        );
      },
    },
  },
  data() {
    return {
      form: {
        colorQuality: null,
        timeOfPart: null,
        FPS: null,
        autoDownload: null,
      },
    };
  },
  computed: {
    colorQualityOptions() {
      return [
        { text: 'Normal', value: 'Normal' },
        //{ text: 'High', value: 'High' },
      ];
    },
    autoDownloadOptions() {
      return [
        { text: 'Enable', value: 'Enable' },
        //{ text: 'Disable', value: 'Disable' },
      ];
    },
  },
  validations() {
    return {
      form: {
        colorQuality: {
          required,
        },
        timeOfPart: {
          required,
        },
        FPS: {
          required,
        },
        autoDownload: {
          required,
        },
      },
    };
  },
  methods: {
    handleSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      const FPS = Number(this.form.FPS);
      if (this.form.FPS.length > 5 || FPS < 1 || FPS > 30) return;
      const timeOfPart = Number(this.form.timeOfPart);
      if (
        this.form.timeOfPart.length > 5 ||
        timeOfPart < 10 ||
        timeOfPart > 600
      )
        return;
      this.$emit('ok', {
        colorQuality: this.form.colorQuality,
        timeOfPart: timeOfPart,
        FPS: FPS,
        autoDownload: this.form.autoDownload,
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
      if (this.videoRecording) {
        this.form.colorQuality = this.videoRecording.colorQuality;
        this.form.timeOfPart = this.videoRecording.timeOfPart;
        this.form.FPS = this.videoRecording.FPS.toString();
        this.form.autoDownload = this.videoRecording.autoDownload;
      } else {
        this.form.colorQuality = this.colorQualityOptions[0].value;
        this.form.timeOfPart = '60';
        this.form.FPS = '5';
        this.form.autoDownload = this.autoDownloadOptions[0].value;
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
