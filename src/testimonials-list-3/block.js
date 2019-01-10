/**
 * BLOCK: testimonials-list-3
 *
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.editor;

import { blockProps, ContainerSave } from '../commonComponents/container/container';
import Edit from './edit';

/**
 * Provides the initial data for new block
 * @type {{title: string, icon: string, iconMediaId: string, iconMediaUrl: string, description: string}}
 */
export const defaultItem = {
    testimonial: __( 'New testimonial', 'kenzap-testimonials' ),
    imageId: '',
    imageUrl: '',
    author: __( 'John Doe', 'kenzap-testimonials' ),
};

export const defaultSubBlocks = JSON.stringify( [
    {
        testimonial: __( 'Nulla ante eros, venenatis vel male suada sit amet.', 'kenzap-testimonials' ),
        author: __( 'Nicolas Brown, Instructor', 'kenzap-testimonials' ),
        imageId: '',
        imageUrl: window.kenzap_testimonials_gutenberg_path + 'testimonials-list-3/testimonial-img-1.png',
        key: new Date().getTime() + 1,
    }, {
        testimonial: __( 'Consectetur adipisci ngel it lorem ipsum dolor sit.', 'kenzap-testimonials' ),
        author: __( 'Ema Ducon, Student', 'kenzap-testimonials' ),
        imageId: '',
        imageUrl: window.kenzap_testimonials_gutenberg_path + 'testimonials-list-3/testimonial-img-2.png',
        key: new Date().getTime() + 2,
    }, {
        testimonial: __( 'Lorem ip sum dolor sit ameti co nse ctetur adipi scing.', 'kenzap-testimonials' ),
        author: __( 'Maria Jonson, Student', 'kenzap-testimonials' ),
        imageId: '',
        imageUrl: window.kenzap_testimonials_gutenberg_path + 'testimonials-list-3/testimonial-img-3.png',
        key: new Date().getTime() + 3,
    },
] );

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
        '--p': `${ attributes.testimonialSize }px`,
        '--plh': `${ attributes.testimonialSize * 1.2 }px`,
        '--paddings': `${ attributes.containerPadding }`,
        '--paddingsMin': `${ attributes.containerPadding / 4 }`,
        '--paddingsMinPx': `${ attributes.containerPadding / 4 }px`,
    };

    return {
        kenzapContanerStyles,
        vars,
    };
};

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
registerBlockType( 'kenzap/testimonials-list-3', {
    title: __( 'Kenzap Testimonials List 3', 'kenzap-testimonials' ),
    icon: 'yes',
    category: 'layout',
    keywords: [
        __( 'Testimonials', 'kenzap-testimonials' ),
    ],
    anchor: true,
    html: true,
    attributes: {
        ...blockProps,
        // override from container
        containerPadding: {
            type: 'number',
            default: 58,
        },

        // override from container
        backgroundImage: {
            type: 'string',
            default: window.kenzap_testimonials_gutenberg_path + 'testimonials-list-3/testimonials-bg.jpg',
        },

        testimonialSize: {
            type: 'number',
            default: 30,
        },

        authorSize: {
            type: 'number',
            default: 16,
        },

        textColor: {
            type: 'string',
            default: '#fff',
        },

        items: {
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
    },

    edit: ( props ) => {
        if ( props.attributes.items.length === 0 && props.attributes.isFirstLoad ) {
            props.setAttributes( {
                items: [ ...JSON.parse( defaultSubBlocks ) ],
                isFirstLoad: false,
            } );
            // TODO It is very bad solution to avoid low speed working of setAttributes function
            props.attributes.items = JSON.parse( defaultSubBlocks );
            if ( ! props.attributes.blockUniqId ) {
                props.setAttributes( {
                    blockUniqId: new Date().getTime(),
                } );
            }
        }

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

        return (
            <div className={ className ? className : '' } style={ vars }>
                <ContainerSave
                    className={ `kenzap-testimonials-3 block-${ attributes.blockUniqId }` }
                    attributes={ attributes }
                    withBackground
                    withPadding
                >
                    <div className="kenzap-container" style={ kenzapContanerStyles }>
                        <div className="owl-carousel">
                            { attributes.items && attributes.items.map( item => (
                                <div
                                    key={ item.key }
                                    className="testimonial-box"
                                >
                                    <div className="testimonial-image">
                                        <img src={ item.imageUrl } alt={ item.author.replace( /<(?:.|\n)*?>/gm, '' ) } />
                                    </div>
                                    <div className="testimonial-content">
                                        <RichText.Content
                                            tagName="p"
                                            value={ item.testimonial }
                                            style={ {
                                                color: attributes.textColor,
                                            } }
                                        />
                                        <RichText.Content
                                            tagName="span"
                                            value={ item.author }
                                            style={ {
                                                color: attributes.textColor,
                                                fontSize: `${ attributes.authorSize }px`,
                                                lineHeight: `${ attributes.authorSize * 1.2 }px`,
                                            } }
                                        />
                                    </div>
                                </div>
                            ) ) }
                        </div>
                    </div>
                </ContainerSave>
            </div>
        );
    },
} );
