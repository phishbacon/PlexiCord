export interface Account {
  id: number;
  uuid: string;
  username: string;
  title: string;
  email: string;
  friendlyName: string;
  locale: null;
  confirmed: boolean;
  joinedAt: number;
  emailOnlyAuth: boolean;
  hasPassword: boolean;
  protected: boolean;
  thumb: string;
  authToken: string;
  mailingListStatus: string;
  mailingListActive: boolean;
  scrobbleTypes: string;
  country: string;
  pin: string;
  subscription: Subscription;
  subscriptionDescription: string;
  restricted: boolean;
  anonymous: boolean;
  home: boolean;
  guest: boolean;
  homeSize: number;
  homeAdmin: boolean;
  maxHomeSize: number;
  rememberExpiresAt: number;
  profile: Profile;
  entitlements: string[];
  roles: string[];
  services: Service[];
  adsConsent: null;
  adsConsentSetAt: null;
  adsConsentReminderAt: null;
  experimentalFeatures: boolean;
  twoFactorEnabled: boolean;
  backupCodesCreated: boolean;
  attributionPartner: null;
}

interface Service {
  identifier: string;
  endpoint: string;
  token: null | string;
  secret: null | string;
  status: string;
}

interface Profile {
  autoSelectAudio: boolean;
  defaultAudioAccessibility: number;
  defaultAudioLanguage: string;
  defaultAudioLanguages: null;
  defaultSubtitleLanguage: string;
  defaultSubtitleLanguages: null;
  autoSelectSubtitle: number;
  defaultSubtitleAccessibility: number;
  defaultSubtitleForced: number;
  watchedIndicator: number;
  mediaReviewsVisibility: number;
  mediaReviewsLanguages: null;
}

interface Subscription {
  active: boolean;
  subscribedAt: string;
  status: string;
  paymentService: string;
  plan: string;
  features: string[];
}

export interface Resource {
  name: string;
  product: string;
  productVersion: string;
  platform: null | string;
  platformVersion: null | string;
  device: null | string;
  clientIdentifier: string;
  provides: string;
  ownerId: null | number;
  sourceTitle: null | string;
  publicAddress: string;
  accessToken: null | string;
  searchEnabled: boolean;
  createdAt: string;
  lastSeenAt: string;
  owned: boolean;
  home: boolean;
  synced: boolean;
  relay: boolean;
  presence: boolean;
  httpsRequired: boolean;
  publicAddressMatches: boolean;
  dnsRebindingProtection?: boolean;
  natLoopbackSupported?: boolean;
  connections: Connection[];
}

export interface Connection {
  protocol: string;
  address: string;
  port: number;
  uri: string;
  local: boolean;
  relay: boolean;
  IPv6: boolean;
}

export interface Sessions {
  MediaContainer: MediaContainer;
}

interface MediaContainer {
  size: number;
  Metadata: Metadata[];
}

export interface Metadata {
  addedAt: number;
  art: string;
  duration: number;
  grandparentArt: string;
  grandparentGuid: string;
  grandparentKey: string;
  grandparentRatingKey: string;
  grandparentThumb: string;
  grandparentTitle: string;
  guid: string;
  index: number;
  key: string;
  lastViewedAt: number;
  librarySectionID: string;
  librarySectionKey: string;
  librarySectionTitle: string;
  musicAnalysisVersion: string;
  parentGuid: string;
  parentIndex: number;
  parentKey: string;
  parentRatingKey: string;
  parentStudio: string;
  parentThumb: string;
  parentTitle: string;
  parentYear: number;
  ratingCount: number;
  ratingKey: string;
  sessionKey: string;
  thumb: string;
  title: string;
  type: string;
  updatedAt: number;
  viewCount: number;
  viewOffset: number;
  Media: Media[];
  User: User;
  Player: Player;
}

export interface Player {
  address: string;
  device: string;
  machineIdentifier: string;
  platform: string;
  platformVersion: string;
  product: string;
  profile: string;
  remotePublicAddress: string;
  state: string;
  title: string;
  version: string;
  local: boolean;
  relayed: boolean;
  secure: boolean;
  userID: number;
}

interface User {
  id: string;
  thumb: string;
  title: string;
}

interface Media {
  audioChannels: number;
  audioCodec: string;
  bitrate: number;
  container: string;
  duration: number;
  hasVoiceActivity: string;
  id: string;
  Part: Part[];
}

interface Part {
  container: string;
  duration: number;
  file: string;
  hasThumbnail: string;
  id: string;
  key: string;
  size: number;
  Stream: Stream[];
}

interface Stream {
  albumGain?: string;
  albumPeak?: string;
  albumRange?: string;
  audioChannelLayout?: string;
  bitDepth?: number;
  bitrate?: number;
  channels?: number;
  codec: string;
  displayTitle: string;
  extendedDisplayTitle: string;
  gain?: string;
  id: string;
  index?: number;
  loudness?: string;
  lra?: string;
  peak?: string;
  samplingRate?: number;
  selected?: boolean;
  streamType: number;
  format?: string;
  key?: string;
  provider?: string;
}
