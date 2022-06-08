const styles = {
  select: {
    bg: '#F5F5F5',
    color: 'black',
    fontWeight: 'bold',
    _selectedItem: {
      bg: 'teal.600',
      _text: {
        color: 'white',
      },
    },
    mt: 1,
  },
  uploadFile: {
    alignItems: 'flex-start',
    bg: '#F5F5F5',
    direction: 'column',
  },
  uploadFileText: {
    textAlign: 'left',
    fontSize: 12,
    mt: '8px',
    color: '#00000073',
  },
  fileUploaded: {
    direction: 'row',
    h: '72px',
    bg: '#F5F5F5',
    borderRadius: '8px',
    mt: '20px',
    alignItems: 'center',
    justifyContent: 'center',
    p: '8px',
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    bg: '#0000001A',
    w: '24px',
    h: '24px',
    borderRadius: '12px',
    ml: '8px',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    direction: 'column',
    mt: '12px',
  },
  buttonVerify: {
    _disabled: {
      bg: '#00000036',
      _text: {
        color: '#0000004D',
      },
    },
    height: '50px',
  },
  shadow: {
    elevation: 4,
    shadowColor: 'black',
  },
};
export default styles;
