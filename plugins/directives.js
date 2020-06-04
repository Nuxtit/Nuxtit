import Vue from 'vue';

import get from 'lodash/get';
import includes from 'lodash/includes';
import find from 'lodash/find';
import findLast from 'lodash/findLast';
import first from 'lodash/first';

import bCollapse from 'bootstrap-vue/es/components/collapse/collapse';
import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox';
import bFormRadioGroup from 'bootstrap-vue/es/components/form-radio/form-radio-group';
import bFormRadio from 'bootstrap-vue/es/components/form-radio/form-radio';
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input';
import bButton from 'bootstrap-vue/es/components/button/button';
import bDropdownItem from 'bootstrap-vue/es/components/dropdown/dropdown-item';
import bBadge from 'bootstrap-vue/es/components/badge/badge';
import bSelect from 'bootstrap-vue/es/components/form-select/form-select';
import bModal from 'bootstrap-vue/es/components/modal/modal';
import bFormTextarea from 'bootstrap-vue/es/components/form-textarea/form-textarea';

import CommentEntry from '~/components/CommentEntry';
import CommentForm from '~/components/CommentForm';
import CommentList from '~/components/CommentList';
import CommentTree from '~/components/CommentTree';
import DownVote from '~/components/DownVote';
import ItemHtml from '~/components/ItemHtml';
import Loading from '~/components/Loading';
import MessageEntry from '~/components/MessageEntry';
import MessageTree from '~/components/MessageTree';
import MixedList from '~/components/MixedList';
import PostEntry from '~/components/PostEntry';
import PostList from '~/components/PostList';
import PostThumbnail from '~/components/PostThumbnail';
import PostWithComments from '~/components/PostWithComments.vue';
import RedditPagination from '~/components/RedditPagination';
import SelectQueryLimit from '~/components/SelectQueryLimit';
import SelectRedditSort from '~/components/SelectRedditSort';
import SaveButton from '~/components/SaveButton';
import ShareButton from '~/components/ShareButton';
import Score from '~/components/Score';
import TimeAgo from '~/components/TimeAgo';
import UpVote from '~/components/UpVote';
import UserLink from '~/components/UserLink';
import ShowSource from '~/components/ShowSource';

import CommentCollection from '~/mixins/CommentCollection';
import RedditItems from '~/mixins/RedditItems';
import QueryParamCount from '~/mixins/QueryParamCount';
import QueryParamLimit from '~/mixins/QueryParamLimit';

Vue.component('ShowSource', ShowSource);
Vue.component('Loading', Loading);

Vue.component('b-collapse', bCollapse);
Vue.component('b-form-checkbox', bFormCheckbox);
Vue.component('b-form-radio-group', bFormRadioGroup);
Vue.component('b-form-radio', bFormRadio);
Vue.component('b-form-input', bFormInput);
Vue.component('b-form-textarea', bFormTextarea);
Vue.component('b-button', bButton);
Vue.component('b-dropdown-item', bDropdownItem);
Vue.component('b-badge', bBadge);
Vue.component('b-select', bSelect);
Vue.component('b-modal', bModal);

// these two lines fix a hotreload bugfix
// because they call each other recursively
Vue.component('CommentTree', CommentTree);
Vue.component('CommentEntry', CommentEntry);
Vue.component('MessageTree', MessageTree);
Vue.component('MessageEntry', MessageEntry);

export default async ctx => {
  //
};

const disabled_class = 'disabled';

Vue.directive('disabled', (el, binding) => {
  if (binding.value) {
    el.disabled = true;
    el.setAttribute('aria-disabled', true);
    el.classList.add(disabled_class);
    el.style.cursor = 'not-allowed';
  } else {
    el.disabled = false;
    el.removeAttribute('aria-disabled');
    el.classList.remove(disabled_class);
    el.style.cursor = null;
  }
});

Vue.prototype.$mergeRouteQuery = function(object) {
  return {
    ...this.$route,
    query: {
      ...this.$route.query,
      ...object,
    },
  };
};

Vue.prototype.$write_clipboard = function(value) {
  return navigator.clipboard.writeText(value)
}
