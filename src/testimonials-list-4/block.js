import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText, InnerBlocks } = wp.editor;
import { blockProps, ContainerSave } from '../commonComponents/container/container';
import { getTypography } from '../commonComponents/typography/typography';
import Edit from './edit';

/**
 * Provides the initial data for new block
 * @type {{title: string, icon: string, iconMediaId: string, iconMediaUrl: string, description: string}}
 */
export const defaultItem = {
    testimonial: __( '<em>Sagittis nisl rhoncus vitae nunc sed velit dignissim, rhoncus urna curabitur</em>', 'kenzap-testimonials' ),
    author: __( 'Karl Thomas / Photographer', 'kenzap-testimonials' ),
    imageId: '',
    imageUrl: '',
};

export const defaultSubBlocks = JSON.stringify( [
    {
        testimonial: __( '<em>Sagittis nisl rhoncus vitae nunc sed velit dignissim, rhoncus urna curabitur</em>', 'kenzap-testimonials' ),
        author: __( 'Nicolas Brown, Instructor', 'kenzap-testimonials' ),
        imageId: '',
        imageUrl: window.kenzap_testimonials_gutenberg_path + 'testimonials-list-4/testimonial-img-1.png',
        key: new Date().getTime() + 1,
    }, {
        testimonial: __( '<em>Sagittis nisl rhoncus rhoncus urna curabitur vitae nunc sed velit dignissim</em>', 'kenzap-testimonials' ),
        author: __( 'Agnes Gibbs / Designer', 'kenzap-testimonials' ),
        imageId: '',
        imageUrl: window.kenzap_testimonials_gutenberg_path + 'testimonials-list-4/testimonial-img-2.png',
        key: new Date().getTime() + 2,
    }, {
        testimonial: __( '<em>Curabitur vitae nunc sed velit dignissim, sagittis nisl rhoncus rhoncus urna</em>', 'kenzap-testimonials' ),
        author: __( 'Frank Cardenas / Senior Designer', 'kenzap-testimonials' ),
        imageId: '',
        imageUrl: window.kenzap_testimonials_gutenberg_path + 'testimonials-list-4/testimonial-img-3.png',
        key: new Date().getTime() + 3,
    },
] );

export const attrs = {
        ...blockProps,
        // override from container
        containerPadding: {
            type: 'number',
            default: 58,
        },

        // override from container
        backgroundColor: {
            type: 'string',
            default: '#fff',
        },

        imgHeight: {
            type: 'number',
            default: 509,
        },

        testimonialColor: {
            type: 'string',
            default: '#000',
        },

        authorColor: {
            type: 'string',
            default: '#9c9c9c',
        },

        items: {
            type: 'array',
            default: [],
        },

        typography: {
            type: 'array',
            default: [],
        },

        isFirstLoad: {
            type: 'boolean',
            default: true,
        },

        blockUniqId: {
            type: 'number',
            default: 0,
        },
    };

/**
 * Generate inline styles for custom settings of the block
 * @param {Object} attributes - of the block
 * @returns {Node} generated styles
 */
export const getStyles = attributes => {
    const kenzapContanerStyles = {
        maxWidth: `${ attributes.containerMaxWidth === '100%' ? '100%' : attributes.containerMaxWidth + 'px' }`,
        '--maxWidth': `${ attributes.containerMaxWidth === '100%' ? '100wh' : attributes.containerMaxWidth + ' ' } `,
    };

    const vars = {
        '--paddings': `${ attributes.containerPadding }`,
        '--paddings2': `${ attributes.containerSidePadding }px`,
    };

    return {
        kenzapContanerStyles,
        vars,
    };
};

export const sanitizeAttr = ( val ) => {
    return typeof( val ) === 'undefined' ?
        '' :
        val
            .replace( /&/g, '&amp;' )
            .replace( /</g, '&lt;' )
            .replace( />/g, '&gt;' )
            .replace( /"/g, '&quot;' )
            .replace( /'/g, '&#039' );
};

/**
 * Define typography defaults
 */
export const typographyArr = JSON.stringify([
    {
        'title': __( '- Testimonial', 'kenzap-testimonials' ),
        'font-size': 30,
        'font-weight': 4,
        'line-height': 43,
        'margin-bottom': 30,
        'color':'#333333'
    },
    {
        'title': __( '- Author', 'kenzap-testimonials' ),
        'font-size': 16,
        'font-weight': 4,
        'line-height': 20,
        'margin-bottom': 30,
        'color':'#9c9c9c'
    },
]);

/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kenzap/testimonials-list-4', {
    title: __( 'Kenzap Testimonials List 4', 'kenzap-testimonials' ),
    icon: 'yes',
    category: 'layout',
    keywords: [
        __( 'Testimonials', 'kenzap-testimonials' ),
    ],
    anchor: true,
    html: true,
    supports: {
        align: [ 'full', 'wide' ],
    },
    attributes: attrs,

    edit: ( props ) => {
        if ( props.attributes.items.length === 0 && props.attributes.isFirstLoad ) {
            props.setAttributes( {
                items: [ ...JSON.parse( defaultSubBlocks ) ],
                isFirstLoad: false,
            } );

            props.attributes.items = JSON.parse( defaultSubBlocks );
            if ( ! props.attributes.blockUniqId ) {
                props.setAttributes( {
                    blockUniqId: new Date().getTime(),
                } );
            }
        }

        Object.keys( props.attributes ).forEach( attr => {
            if ( typeof props.attributes[ attr ] === 'undefined' ) {
                props.attributes[ attr ] = attrs[ attr ].default;
            }
        } );

        return ( <Edit { ...props } /> );
    },

    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into post_content.
     *
     * The "save" property must be specified and must be a valid function.
     * @param {Object} props - attributes
     * @returns {Node} rendered component
     */
    save: function( props ) {
        const {
            className,
            attributes,
        } = props;

        const { vars, kenzapContanerStyles } = getStyles( props.attributes );

        Object.keys( attributes ).forEach( attr => {
            if ( typeof attributes[ attr ] === 'undefined' ) {
                attributes[ attr ] = attrs[ attr ].default;
            }
        } );

        return (
            <div className={ className ? className : '' } style={ vars }>
                <ContainerSave
                    className={ `kenzap-testimonials-4 block-${ attributes.blockUniqId }` }
                    attributes={ attributes }
                    withBackground
                    withPadding
                >
                    <div className="kenzap-container" style={ kenzapContanerStyles }>
                        { attributes.nestedBlocks == 'top' && <InnerBlocks.Content /> }
                        <div id="owl-dots" className="owl-dots">
                            { attributes.items && attributes.items.map( ( item, index ) => (
                                <div key={ item.key } style={ { height: `${ attributes.imgHeight }px`, maxHeight: '100%' } } className={ `owl-dot ${ index === 0 ? 'active' : '' }` }>
                                    <img src={ item.imageUrl } alt={ sanitizeAttr(item.author) } />
                                </div>
                            ) ) }
                        </div>
                        <div className="owl-carousel">
                            { attributes.items && attributes.items.map( item => (
                                <div
                                    key={ item.key }
                                    className="testimonial-box"
                                >
                                    <div className="kp-content">
                                        <RichText.Content
                                            tagName="div"
                                            className="kp-p"
                                            value={ item.testimonial }
                                            style={ getTypography( attributes, 0 ) }
                                        />
                                        <RichText.Content
                                            tagName="span"
                                            value={ item.author }
                                            style={ getTypography( attributes, 1 ) }
                                        />
                                    </div>
                                </div>
                            ) ) }
                        </div>
                        { attributes.nestedBlocks == 'bottom' && <InnerBlocks.Content /> }
                    </div>
                </ContainerSave>
            </div>
        );
    },
} );
