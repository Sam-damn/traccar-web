import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, Container, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, FormGroup,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocalization, useTranslation, useTranslationKeys } from '../common/components/LocalizationProvider';
import usePersistedState from '../common/util/usePersistedState';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { prefixString, unprefixString } from '../common/util/stringUtils';
import SelectField from '../common/components/SelectField';
import useMapStyles from '../map/core/useMapStyles';
import useMapOverlays from '../map/overlay/useMapOverlays';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));

const PreferencesPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const userId = useSelector((state) => state.session.user.id);

  const { languages, language, setLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({ code: values[0], name: values[1].name }));

  const mapStyles = useMapStyles();
  const [activeMapStyles, setActiveMapStyles] = usePersistedState('activeMapStyles', ['locationIqStreets', 'osm', 'carto']);

  const mapOverlays = useMapOverlays();
  const [selectedMapOverlay, setSelectedMapOverlay] = usePersistedState('selectedMapOverlay');

  const positionAttributes = usePositionAttributes(t);
  const [positionItems, setPositionItems] = usePersistedState('positionItems', ['speed', 'address', 'totalDistance', 'course']);

  const [mapGeofences, setMapGeofences] = usePersistedState('mapGeofences', true);
  const [mapLiveRoutes, setMapLiveRoutes] = usePersistedState('mapLiveRoutes', false);
  const [mapFollow, setMapFollow] = usePersistedState('mapFollow', false);
  const [mapCluster, setMapCluster] = usePersistedState('mapCluster', true);
  const [mapOnSelect, setMapOnSelect] = usePersistedState('mapOnSelect', false);

  const alarms = useTranslationKeys((it) => it.startsWith('alarm')).map((it) => ({
    key: unprefixString('alarm', it),
    name: t(it),
  }));

  const [soundEvents, setSoundEvents] = usePersistedState('soundEvents', []);
  const [soundAlarms, setSoundAlarms] = usePersistedState('soundAlarms', ['sos']);

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'sharedPreferences']}>
      <Container maxWidth="xs" className={classes.container}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedPreferences')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <FormControl>
              <InputLabel>{t('loginLanguage')}</InputLabel>
              <Select
                label={t('loginLanguage')}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languageList.map((it) => <MenuItem key={it.code} value={it.code}>{it.name}</MenuItem>)}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('mapTitle')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <FormControl>
              <InputLabel>{t('mapActive')}</InputLabel>
              <Select
                label={t('mapActive')}
                value={activeMapStyles}
                onChange={(e, child) => {
                  const clicked = mapStyles.find((s) => s.id === child.props.value);
                  if (clicked.available) {
                    setActiveMapStyles(e.target.value);
                  } else if (clicked.id !== 'custom') {
                    const query = new URLSearchParams({ attribute: clicked.attribute });
                    navigate(`/settings/user/${userId}?${query.toString()}`);
                  }
                }}
                multiple
              >
                {mapStyles.map((style) => (
                  <MenuItem key={style.id} value={style.id}>
                    <Typography component="span" color={style.available ? 'textPrimary' : 'error'}>{style.title}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>{t('mapOverlay')}</InputLabel>
              <Select
                label={t('mapOverlay')}
                value={selectedMapOverlay}
                onChange={(e) => {
                  const clicked = mapOverlays.find((o) => o.id === e.target.value);
                  if (!clicked || clicked.available) {
                    setSelectedMapOverlay(e.target.value);
                  } else if (clicked.id !== 'custom') {
                    const query = new URLSearchParams({ attribute: clicked.attribute });
                    navigate(`/settings/user/${userId}?${query.toString()}`);
                  }
                }}
              >
                <MenuItem value="">{'\u00a0'}</MenuItem>
                {mapOverlays.map((overlay) => (
                  <MenuItem key={overlay.id} value={overlay.id}>
                    <Typography component="span" color={overlay.available ? 'textPrimary' : 'error'}>{overlay.title}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>{t('sharedAttributes')}</InputLabel>
              <Select
                label={t('sharedAttributes')}
                value={positionItems}
                onChange={(e) => setPositionItems(e.target.value)}
                multiple
              >
                {Object.keys(positionAttributes).map((key) => (
                  <MenuItem key={key} value={key}>{positionAttributes[key].name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={mapGeofences} onChange={(e) => setMapGeofences(e.target.checked)} />}
                label={t('sharedGeofences')}
              />
              <FormControlLabel
                control={<Checkbox checked={mapLiveRoutes} onChange={(e) => setMapLiveRoutes(e.target.checked)} />}
                label={t('mapLiveRoutes')}
              />
              <FormControlLabel
                control={<Checkbox checked={mapFollow} onChange={(e) => setMapFollow(e.target.checked)} />}
                label={t('deviceFollow')}
              />
              <FormControlLabel
                control={<Checkbox checked={mapCluster} onChange={(e) => setMapCluster(e.target.checked)} />}
                label={t('mapClustering')}
              />
              <FormControlLabel
                control={<Checkbox checked={mapOnSelect} onChange={(e) => setMapOnSelect(e.target.checked)} />}
                label={t('mapOnSelect')}
              />
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedSound')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <SelectField
              multiple
              value={soundEvents}
              onChange={(e) => setSoundEvents(e.target.value)}
              endpoint="/api/notifications/types"
              keyGetter={(it) => it.type}
              titleGetter={(it) => t(prefixString('event', it.type))}
              label={t('reportEventTypes')}
            />
            <SelectField
              multiple
              value={soundAlarms}
              onChange={(e) => setSoundAlarms(e.target.value)}
              data={alarms}
              keyGetter={(it) => it.key}
              label={t('sharedAlarms')}
            />
          </AccordionDetails>
        </Accordion>
      </Container>
    </PageLayout>
  );
};

export default PreferencesPage;
