import { IconLayer } from '@deck.gl/layers/typed'

const defaultProps = {
  ...IconLayer.defaultProps,
}

export default class BlobLayer extends IconLayer {
  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'fs:#main-end': `\
        if(texColor.a > 0.99) {
          gl_FragColor.a = 1.0;
        } else {
          discard;
        }
    `,
    }
    return shaders
  }
  //   draw(params) {
  //     const {animationCurrentFrame, animationNumCols, animationNumRows} = this.props;
  //     const animationCol = animationCurrentFrame % animationNumCols;
  //     const animationRow = Math.floor(animationCurrentFrame / animationNumCols);
  //     params.uniforms = {
  //       ...params.uniforms,
  //       animationNumColsRatio: 1 / animationNumCols,
  //       animationNumRowsRatio: 1 / animationNumRows,
  //       animationCol,
  //       animationRow
  //     };
  //     super.draw(params);
  //   }
}

BlobLayer.layerName = 'BlobLayer'
// BlobLayer.defaultProps = defaultProps
