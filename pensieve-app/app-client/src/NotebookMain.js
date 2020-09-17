import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function VerticalTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="1st" {...a11yProps(0)} />
        <Tab label="2nd" {...a11yProps(1)} />
        <Tab label="3rd" {...a11yProps(2)} />
        <Tab label="4th" {...a11yProps(3)} />
        <Tab label="5th" {...a11yProps(4)} />
        <Tab label="6th" {...a11yProps(5)} />
        <Tab label="PA" {...a11yProps(6)} />
        <Tab label="A1" {...a11yProps(7)} />
        <Tab label="G" {...a11yProps(8)} />
        <Tab label="A2" {...a11yProps(9)} />
        <Tab label="PC" {...a11yProps(10)} />
        <Tab label="C" {...a11yProps(11)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        1st
      </TabPanel>
      <TabPanel value={value} index={1}>
        2nd
      </TabPanel>
      <TabPanel value={value} index={2}>
        3rd
      </TabPanel>
      <TabPanel value={value} index={3}>
        4th
      </TabPanel>
      <TabPanel value={value} index={4}>
        5th
      </TabPanel>
      <TabPanel value={value} index={5}>
        6th
      </TabPanel>
      <TabPanel value={value} index={6}>
        PA
      </TabPanel>
      <TabPanel value={value} index={7}>
        A1
      </TabPanel>
      <TabPanel value={value} index={8}>
        G
      </TabPanel>
      <TabPanel value={value} index={9}>
        A2
      </TabPanel>
      <TabPanel value={value} index={10}>
        PC
      </TabPanel>
      <TabPanel value={value} index={11}>
        C
      </TabPanel>
    </div>
  );
}
