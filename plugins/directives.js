import Vue from 'vue';

import get from 'lodash/get';
import includes from 'lodash/includes';
import find from 'lodash/find';
import findLast from 'lodash/findLast';
import first from 'lodash/first';
import undata from '~/lib/undata';

import { BCollapse } from 'bootstrap-vue/esm/components/collapse/collapse';
import { BFormCheckbox } from 'bootstrap-vue/esm/components/form-checkbox/form-checkbox';
import { BFormRadioGroup } from 'bootstrap-vue/esm/components/form-radio/form-radio-group';
import { BFormRadio } from 'bootstrap-vue/esm/components/form-radio/form-radio';
import { BFormInput } from 'bootstrap-vue/esm/components/form-input/form-input';
import { BButton } from 'bootstrap-vue/esm/components/button/button';
import { BDropdownItem } from 'bootstrap-vue/esm/components/dropdown/dropdown-item';
import { BBadge } from 'bootstrap-vue/esm/components/badge/badge';
import { BFormSelect } from 'bootstrap-vue/esm/components/form-select';
import { BFormTextarea } from 'bootstrap-vue/esm/components/form-textarea/form-textarea';
import { BTab, BTabs } from 'bootstrap-vue/esm/components/tabs';
import { BNavItem } from 'bootstrap-vue/esm/components/nav/nav-item';
import { BNav } from 'bootstrap-vue/esm/components/nav/nav';

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

Vue.component('b-collapse', BCollapse);
Vue.component('b-form-checkbox', BFormCheckbox);
Vue.component('b-form-radio-group', BFormRadioGroup);
Vue.component('b-form-radio', BFormRadio);
Vue.component('b-form-input', BFormInput);
Vue.component('b-form-textarea', BFormTextarea);
Vue.component('b-button', BButton);
Vue.component('b-dropdown-item', BDropdownItem);
Vue.component('b-badge', BBadge);
Vue.component('b-select', BFormSelect);
Vue.component('b-nav', BNav);
Vue.component('b-nav-item', BNavItem);

// these two lines fix a hotreload bugfix
// because they call each other recursively
Vue.component('CommentTree', CommentTree);
Vue.component('CommentEntry', CommentEntry);
Vue.component('MessageTree', MessageTree);
Vue.component('MessageEntry', MessageEntry);
Vue.component('b-tabs', BTabs);
Vue.component('b-tab', BTab);

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
  return navigator.clipboard.writeText(value);
};
