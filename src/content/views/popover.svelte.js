class Popover {
  isShown = $state(false);
  params = $state({});
  onSave = null;

  open = (params, onSave) => {
    this.isShown = true;
    this.params = params;
    this.onSave = onSave;
  };

  close = () => {
    this.isShown = false;
    this.params = {};
    this.onSave = null;
  };
}

export const popover = new Popover();
