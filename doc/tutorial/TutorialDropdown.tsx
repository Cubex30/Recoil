import * as React from 'react';

import Align from '../../src/components/Align/Align';
import Button from '../../src/components/Button/Button';
import Card from '../../src/components/Card/Card';
import Checkbox from '../../src/components/Checkbox/Checkbox';
import Door from '../../src/components/Door/Door';
import Dropdown from '../../src/components/Dropdown/Dropdown';
import Emerge from '../../src/components/Emerge/Emerge';
import Grid from '../../src/components/Grid/Grid';
import Input from '../../src/components/Input/Input';
import Layer from '../../src/components/Layer/Layer';
import Loading from '../../src/components/Loading/Loading';
import Modal from '../../src/components/Modal/Modal';
import Pane from '../../src/components/Pane/Pane';
import Selectable from '../../src/components/Selectable/Selectable';
import Shrink from '../../src/components/Shrink/Shrink';
import Toolbar from '../../src/components/Toolbar/Toolbar';
import Transform from '../../src/components/Transform/Transform';
import Wizard from '../../src/components/Wizard/Wizard';

const dropData = ['from', 'block', 'contentClass', 'onSelected', 'type', 'data'];

const DropdownProperties = [
  {
    name :'from',
    type: 'string',
    options: 'X X, use top bottom left right',
    description: 'Defines the direction of the drop.'
  },
  {
    name :'block',
    type: 'boolean',
    options: 'true, false',
    description: 'Defines if the dropdown is a block element with a width of 100%.'
  },
  {
    name :'contentClass',
    type: 'boolean',
    options: 'true, false',
    description: 'Defines a set of class names for the dropdown content container.'
  },
  {
    name :'onSelected',
    type: 'function',
    options: 'true, false',
    description: 'Return the selected value of the array, if the dropdown is of type selection.'
  },
  {
    name :'type',
    type: 'string',
    options: 'selection, button, search.',
    description: 'Defines what type of dropdown it is, omit for default option and pass children.'
  }
]

export default class TutorialDropdown extends React.Component<any,any>{
  constructor() {
    super();

    this.state = {
      showProps : true,
      showVideo: false
    }
  }

  toggleShowProps() {
    this.setState({
      showVideo: false,
      showProps: this.state.showProps ? false : true
    })
  }

  toggleShowVideo() {
    this.setState({
      showProps: false,
      showVideo: this.state.showVideo ? false : true
    })
  }

  render() {

    const self = this;
    const props = self.props;
    let state = self.state;

    const columns = [
      {name: 'name', width:250},
      {name: 'type', width:300},
      {name: 'options', width:250},
      {name: 'description'}
    ]

    return (
      <Emerge>
      <Layer>

        <h1>Dropdown</h1>

        <Layer className="ptb10">
          <h2 className="pb10">Description</h2>
          <p>The Dropdown component is an advanced version of the standard selection options control.</p>
        </Layer>

        <Layer className="ptb10">
          <h2 className="pb10">Examples</h2>
          <Layer className="ptb10">
            <Layer className="p10 light">
              <Dropdown type="selection" title="Dropdown Options" data={dropData} />
            </Layer>
          </Layer>
        </Layer>

        <Layer className="ptb10">
          <h2 className="pb10">Options</h2>
          <Button checked={this.state.showProps} onClick={this.toggleShowProps.bind(this)}>Toggle Options</Button>
          <Door open={this.state.showProps}>
            <Layer className="ptb10">
              <Grid open={this.state.showProps} numberPerPage={20} sortable columns={columns} dataSource={DropdownProperties} />
            </Layer>
          </Door>
        </Layer>

        <Layer className="ptb10">
          <h2 className="pb10">Video</h2>
          <Button checked={this.state.showVideo} onClick={this.toggleShowVideo.bind(this)}>Toggle Video Tutorial</Button>
          <Door open={this.state.showVideo}>
            <Layer className="ptb10">
              VIDEO
            </Layer>
          </Door>
        </Layer>

      </Layer>
      </Emerge>
    )
  }
}
