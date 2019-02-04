class Randomizer
{
    static returnRandomDirection()
    {
        var randomDirection = [true, false];

        function getRandomInt(max)
        {
            return Math.floor(Math.random() * Math.floor(max));
        }

        return randomDirection[getRandomInt(2)];
    }

    static returnRandomInt(max)
    {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static returnRandomFloat(min, max)
    {
        return Math.random() * (max - min) + min;
    }

    static returnRandomIntBetweenThese(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
}
