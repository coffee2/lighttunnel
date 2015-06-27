var quotes = [
    ["What lies behind us and what lies before us are tiny matters compared to what lies within us.", "HENRY S. HASKINS"]
    ,["The gem cannot be polished without friction nor a person without trials", "CONFUCIUS"]
    ,["If you cannot do great things, do small things in a great way.", "NAPOLEON HILL"]
    ,["If opportunity doesn’t knock, build a door.", "MILTON BERLE"]
    ,["An obstacle is often a stepping stone.", "WILLIAM PRESCOTT"]
    ,["Do not let what you cannot do interfere with what you can do.", "JOHN WOODEN"]
    ,["Management is doing things right; leadership is doing the right things.", "PETER F. DRUCKER"]
    ,["What counts is not necessarily the size of the dog in the fight–it’s the size of the fight in the dog.", "DWIGHT D. EISENHOWER"]
    ,["I am always doing that which I cannot do, in order that I may learn how to do it.", "PABLO PICASSO"]
    ,["People will forget what you said. People will forget what you did. But people will never forget how you made them feel.", "MAYA ANGELOU"]
    ,["Remember that happiness is a way of travel, not a destination.", "ROY L. GOODMAN"]
    ,["Logic will get you from A to B. Imagination will take you everywhere.", "ALBERT EINSTEIN"]
    ,["Pain is temporary. It may last a minute, or an hour, or a day, or a year, but eventually it will subside and something else will take its place. If I quit, however, it lasts forever.", "LANCE ARMSTRONG"]
    ,["Enjoy the little things, for one day you may look back and realize they were the big things.", "ROBERT BRAULT"]
    ,["The best way out is always through.", "ROBERT FROST"]
    ,["When nothing goes right, you have to face forward and take it on head first.", "Kyo Shirodaira, Spiral: The Bonds of Reasoning, Vol. 04"]
    ,["At the very end of every struggle comes a precious reward that worth all your blood, sweat and tears.","Edmond Mbiaka"]
    ,["If the wind will not serve, take to the oars.", "Latin Proverb"]
    ,["There is only one way... to get anybody to do anything. And that is by making the other person want to do it.", "Dale Carnegie"]
    ,["One of the strongest characteristics of genius is the power of lighting its own fire.", "John W. Foster"]
];

function celebrate(){
    //
    // Simple example of bouncing balls
    //
    Physics(function (world) {
        // bounds of the window
        var viewportBounds = Physics.aabb(0, 0, window.innerWidth, window.innerHeight)
            ,edgeBounce
            ,renderer
            ;

        // create a renderer
        renderer = Physics.renderer('canvas', {
            el: 'viewport'
            ,debug: true
        });

        // add the renderer
        world.add(renderer);
        // render on each step
        world.on('step', function () {
            world.render();
        });

        // constrain objects to these bounds
        edgeBounce = Physics.behavior('edge-collision-detection', {
            aabb: viewportBounds
            ,restitution: 0.7
            ,cof: 0.8
        });

        // resize events
        window.addEventListener('resize', function () {

            // as of 0.7.0 the renderer will auto resize... so we just take the values from the renderer
            viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
            // update the boundaries
            edgeBounce.setAABB(viewportBounds);

        }, true);

        // create some bodies
        function addOne(){

            world.add( Physics.body('rectangle', {
                x: window.innerWidth * Math.random()
                ,y: -1000*Math.random()|0 - 1000
                ,vx: 0.3* (0.5 - Math.random())
                ,width: 100
                ,height: 100
                ,restitution: 0.8
                ,styles: {
                    src: 'con.png'
                    ,width: 100
                    ,height: 100
                }
            }));
        }

        for (var i = 0; i < 30; i++) {
            addOne();
        }

        world.add(Physics.body('rectangle', {
            x: -5
            ,y: window.innerHeight/2
            ,treatment: 'static'
            ,width: 10
            ,height: window.innerHeight
            ,styles: {
                fillStyle: 'transparent'
            }
        }));
        world.add(Physics.body('rectangle', {
            x: window.innerWidth/2
            ,y: window.innerHeight
            ,treatment: 'static'
            ,width: window.innerWidth
            ,height: 10
            ,styles: {
                fillStyle: 'transparent'
            }
        }));

        world.add(Physics.body('rectangle', {
            x: window.innerWidth + 5
            ,y: window.innerHeight/2
            ,treatment: 'static'
            ,width: 10
            ,height: window.innerHeight
            ,styles: {
                fillStyle: 'transparent'
            }
        }));

        // add some fun interaction
        var attractor = Physics.behavior('attractor', {
            order: 0,
            strength: 0.002
        });
        world.on({
            'interact:poke': function( pos ){
                world.wakeUpAll();
                attractor.position( pos );
                world.add( attractor );
            }
            ,'interact:move': function( pos ){
                attractor.position( pos );
            }
            ,'interact:release': function(){
                world.wakeUpAll();
                world.remove( attractor );
            }
        });

        // add things to the world
        world.add([
            Physics.behavior('interactive', { el: renderer.container })
            ,Physics.behavior('constant-acceleration')
            ,Physics.behavior('body-impulse-response')
            ,Physics.behavior('sweep-prune')
            ,Physics.behavior('body-collision-detection')
            // ,edgeBounce
        ]);

        // subscribe to ticker to advance the simulation
        Physics.util.ticker.on(function( time ) {
            world.step( time );
        });
    });
}

jQuery(function($){

    var $main = $('#main');
    var $time = $('#time');
    var $quote = $('#quote');

    var then = moment('2015-07-17T00');

    var intr;
    function update(){
        var howlong = moment.duration(then.diff( moment() ));

        var format = [
            howlong.days() + ' days'
            ,howlong.hours() + ' hours'
            ,howlong.minutes() + ' minutes'
            ,howlong.seconds() + ' seconds'
        ];

        if ( howlong.asMilliseconds() <= 0 ){
            $main.find('.yes').show();
            $main.find('.no').hide();

            celebrate();
            clearInterval( intr );
        } else {
            $main.find('.no').show();
            intr = setTimeout( update, 1000 );
        }

        $time.html( '<span>' + format.join('</span>, <span>') + '</span>' );
        var q = quotes[ howlong.days() ];
        $quote.html('"'+q[0]+'" &mdash; <em>' + q[1].toUpperCase() + '</em>');
    }

    update();

    $main.show();

});
