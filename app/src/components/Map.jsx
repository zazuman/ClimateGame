import React from 'react';
import PropTypes from 'prop-types';
import Area from './Area';
import DilemmaLocation from './DilemmaLocation';
import Effect from './Effect';
import Utils from '../utils';
import Constants from '../constants'


class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: 1,
            imageRightOffset: 0
        }
    }

    // If for some reason the user resizes the window, this will not be called and will not adjust
    componentDidMount() {
        const imgRect= document.getElementById('map-img').getBoundingClientRect();
        const imgHeight = imgRect.height;
        const imgOffset = imgRect.x;
        this.setState({
            scale: imgHeight / Constants.BASELINE_SIZE.h,
            imageRightOffset: imgOffset,
            imageTopOffset: imgRect.y
        });
    }

    render() {
        // Create areas
        return (
            <div>
                <img src="israel-map.svg" id="map-img" useMap="#image-map" 
                    className={(this.props.popupOpen === true) ? "blurred" : ""}/>
                {
                    Constants.AREAS.map((area, areaI) => 
                        <Area key={'map-area-' + areaI} area={area} scale={this.state.scale}
                              rightOffset={this.state.imageRightOffset} topOffset={this.state.imageTopOffset}>
                                  {
                                      this.props.dilemmas.map((dilemma, dilI) => 
                                        Utils.getDilemma(dilemma.ID).placement - 1 === areaI &&
                                        <DilemmaLocation key={'dilemma_' + dilI} x={dilemma.x} y={dilemma.y} scale={this.state.scale}
                                                        lifetime={Utils.getDilemma(dilemma.ID).lifetime} dilemmaId={dilemma.ID}
                                                        isDeleted={dilemma.isDeleted} onClick={dId => this.props.onDilemmaLocationClick(dId)} />
                                        )
                                  }
                                  {
                                      this.props.effects.map((effect, eI) => 
                                        effect.placement - 1 === areaI &&
                                        <Effect key={'effect_' + eI} x={effect.x} y={effect.y} id={effect.ID}
                                                        onFinish={this.props.onEffectDone} amount={effect.amount}
                                                        metric={effect.metric} delay={effect.delay} />
                                        )
                                  }

                        </Area>
                    )
                }
            </div>
        );
    }
}


Map.propTypes = {
    dilemmas: PropTypes.array.isRequired, // An array of dilemma {ID, isDeleted} objects
    onDilemmaLocationClick: PropTypes.func.isRequired, // receives the dilemma id as a param
    effects: PropTypes.array.isRequired,
    onEffectDone: PropTypes.func.isRequired,
    popupOpen: PropTypes.bool,
}

export default Map;